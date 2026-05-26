namespace proyectofinal.Models;

public class Iteracion
{
    public int Id { get; set; }
    public int JobId { get; set; }
    public int NumeroIteracion { get; set; }
    public string? ValorX { get; set; }
    public double? Error { get; set; }
    public string? DatosAdicionales { get; set; }

    // Relación con Job
    public Job? Job { get; set; }
}
