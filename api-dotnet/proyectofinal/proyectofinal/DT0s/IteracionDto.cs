namespace proyectofinal.DTOs;

public class IteracionDto
{
    public int Id { get; set; }
    public int JobId { get; set; }
    public int NumeroIteracion { get; set; }
    public string? ValorX { get; set; }
    public double? Error { get; set; }
    public string? DatosAdicionales { get; set; }
}