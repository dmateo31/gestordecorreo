export interface IMarcableFavorito {
  marcarComoFavorito(): void;
  desmarcarComoFavorito(): void;
  esFavorito(): boolean;
}