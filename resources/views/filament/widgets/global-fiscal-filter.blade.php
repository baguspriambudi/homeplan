<x-filament-widgets::widget>
    <x-filament::section>
        <form wire:submit.prevent="">
            {{-- Inilah yang memanggil dropdown dari file PHP di atas --}}
            {{ $this->form }}
        </form>
    </x-filament::section>
</x-filament-widgets::widget>