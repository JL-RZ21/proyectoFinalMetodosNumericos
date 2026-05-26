using System.ComponentModel.DataAnnotations;

namespace proyectofinal.DTOs;

public class CrearJobDto
{
    [Required]
    public string Metodo { get; set; } = null!;

    [Required]
    public string Expresion { get; set; } = null!;

    [Required]
    public string Parametros { get; set; } = null!;
}