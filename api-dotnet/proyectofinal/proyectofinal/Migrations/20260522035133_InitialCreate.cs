using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace proyectofinal.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Metodo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Expresion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Parametros = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Resultado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ErrorFinal = table.Column<double>(type: "float", nullable: true),
                    IteracionesTotal = table.Column<int>(type: "int", nullable: true),
                    Converged = table.Column<bool>(type: "bit", nullable: true),
                    MensajeError = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaFinalizacion = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Iteraciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JobId = table.Column<int>(type: "int", nullable: false),
                    NumeroIteracion = table.Column<int>(type: "int", nullable: false),
                    ValorX = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Error = table.Column<double>(type: "float", nullable: true),
                    DatosAdicionales = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Iteraciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Iteraciones_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Iteraciones_JobId",
                table: "Iteraciones",
                column: "JobId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Iteraciones");

            migrationBuilder.DropTable(
                name: "Jobs");
        }
    }
}
