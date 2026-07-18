<?php

namespace App\Services;

use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use InvalidArgumentException;

/**
 * Konversi payload QRIS statis menjadi dinamis (nominal tertanam di QR).
 *
 * Standar EMVCo QRIS: payload berupa rangkaian TLV (tag 2 digit, panjang
 * 2 digit, lalu value). Konversi statis -> dinamis:
 *   - tag 01 (Point of Initiation Method) diubah dari "11" ke "12"
 *   - tag 54 (Transaction Amount) disisipkan berisi nominal
 *   - tag 63 (CRC) dihitung ulang dengan CRC16-CCITT (poly 0x1021, init 0xFFFF)
 */
class QrisService
{
    /**
     * @return string payload QRIS dinamis, atau throw jika payload statis tidak valid
     */
    public function buildDynamicPayload(string $staticPayload, int $amount): string
    {
        $fields = $this->parseTlv(trim($staticPayload));

        if ($fields === []) {
            throw new InvalidArgumentException('Payload QRIS statis tidak valid.');
        }

        $result = '';
        $amountInserted = false;
        $amountValue = (string) $amount;

        foreach ($fields as [$tag, $value]) {
            if ($tag === '63') {
                continue; // CRC lama dibuang, dihitung ulang di akhir
            }

            if ($tag === '01') {
                $value = '12'; // statis (11) -> dinamis (12)
            }

            if ($tag === '54') {
                continue; // nominal lama (jika ada) diganti
            }

            // Sisipkan tag 54 tepat sebelum tag pertama yang lebih besar dari 54
            if (! $amountInserted && strcmp($tag, '54') > 0) {
                $result .= $this->tlv('54', $amountValue);
                $amountInserted = true;
            }

            $result .= $this->tlv($tag, $value);
        }

        if (! $amountInserted) {
            $result .= $this->tlv('54', $amountValue);
        }

        $result .= '6304';

        return $result.$this->crc16($result);
    }

    /**
     * Render payload menjadi QR code SVG (untuk ditampilkan langsung di halaman).
     */
    public function toSvg(string $payload, int $size = 300): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle($size, 1),
            new SvgImageBackEnd,
        );

        $svg = (new Writer($renderer))->writeString($payload);

        // Buang deklarasi XML agar aman disisipkan inline di HTML
        return preg_replace('/^<\?xml[^>]*\?>\s*/', '', $svg);
    }

    /**
     * @return array<int, array{0: string, 1: string}> daftar [tag, value] berurutan
     */
    private function parseTlv(string $payload): array
    {
        $fields = [];
        $offset = 0;
        $length = strlen($payload);

        while ($offset + 4 <= $length) {
            $tag = substr($payload, $offset, 2);
            $len = substr($payload, $offset + 2, 2);

            if (! ctype_digit($len)) {
                return [];
            }

            $len = (int) $len;

            if ($offset + 4 + $len > $length) {
                return [];
            }

            $fields[] = [$tag, substr($payload, $offset + 4, $len)];
            $offset += 4 + $len;
        }

        return $offset === $length ? $fields : [];
    }

    private function tlv(string $tag, string $value): string
    {
        return $tag.str_pad((string) strlen($value), 2, '0', STR_PAD_LEFT).$value;
    }

    private function crc16(string $data): string
    {
        $crc = 0xFFFF;

        foreach (str_split($data) as $char) {
            $crc ^= ord($char) << 8;

            for ($i = 0; $i < 8; $i++) {
                $crc = ($crc & 0x8000) ? (($crc << 1) ^ 0x1021) : ($crc << 1);
                $crc &= 0xFFFF;
            }
        }

        return strtoupper(str_pad(dechex($crc), 4, '0', STR_PAD_LEFT));
    }
}
