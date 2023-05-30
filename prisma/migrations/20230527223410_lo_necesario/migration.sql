/*
  Warnings:

  - You are about to drop the column `Foto` on the `Articulo` table. All the data in the column will be lost.
  - You are about to drop the `Caja` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comprobante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Configuracion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Departamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetalleComprobante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Localidad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Persona` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Persona_Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Persona_Empleado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proveedor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Provincia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Comprobante] DROP CONSTRAINT [FK_dbo.Comprobante_dbo.Persona_Cliente_ClienteId];

-- DropForeignKey
ALTER TABLE [dbo].[Comprobante] DROP CONSTRAINT [FK_dbo.Comprobante_dbo.Persona_Empleado_EmpleadoId];

-- DropForeignKey
ALTER TABLE [dbo].[Comprobante] DROP CONSTRAINT [FK_dbo.Comprobante_dbo.Usuario_UsuarioId];

-- DropForeignKey
ALTER TABLE [dbo].[Configuracion] DROP CONSTRAINT [FK_dbo.Configuracion_dbo.Localidad_LocalidadId];

-- DropForeignKey
ALTER TABLE [dbo].[Departamento] DROP CONSTRAINT [FK_dbo.Departamento_dbo.Provincia_ProvinciaId];

-- DropForeignKey
ALTER TABLE [dbo].[DetalleComprobante] DROP CONSTRAINT [FK_dbo.DetalleComprobante_dbo.Articulo_ArticuloId];

-- DropForeignKey
ALTER TABLE [dbo].[DetalleComprobante] DROP CONSTRAINT [FK_dbo.DetalleComprobante_dbo.Comprobante_ComprobanteId];

-- DropForeignKey
ALTER TABLE [dbo].[Localidad] DROP CONSTRAINT [FK_dbo.Localidad_dbo.Departamento_DepartamentoId];

-- DropForeignKey
ALTER TABLE [dbo].[Persona] DROP CONSTRAINT [FK_dbo.Persona_dbo.Localidad_LocalidadId];

-- DropForeignKey
ALTER TABLE [dbo].[Persona_Cliente] DROP CONSTRAINT [FK_dbo.Persona_Cliente_dbo.Persona_Id];

-- DropForeignKey
ALTER TABLE [dbo].[Persona_Empleado] DROP CONSTRAINT [FK_dbo.Persona_Empleado_dbo.Persona_Id];

-- DropForeignKey
ALTER TABLE [dbo].[Proveedor] DROP CONSTRAINT [FK_dbo.Proveedor_dbo.Localidad_LocalidadId];

-- DropForeignKey
ALTER TABLE [dbo].[Usuario] DROP CONSTRAINT [FK_dbo.Usuario_dbo.Persona_Empleado_EmpleadoId];

-- AlterTable
ALTER TABLE [dbo].[Articulo] DROP CONSTRAINT [DF__Articulo__Permit__70DDC3D8];
ALTER TABLE [dbo].[Articulo] DROP COLUMN [Foto];
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [DF__Articulo__Permit__6383C8BA] DEFAULT 0 FOR [PermiteStockNegativo];
ALTER TABLE [dbo].[Articulo] ADD [FotoUrl] NVARCHAR(max);

-- AlterTable
ALTER TABLE [dbo].[User] ADD [DNI] NVARCHAR(100),
[apellido] NVARCHAR(1000),
[direccion] NVARCHAR(100),
[telefono] NVARCHAR(100);

-- DropTable
DROP TABLE [dbo].[Caja];

-- DropTable
DROP TABLE [dbo].[Comprobante];

-- DropTable
DROP TABLE [dbo].[Configuracion];

-- DropTable
DROP TABLE [dbo].[Departamento];

-- DropTable
DROP TABLE [dbo].[DetalleComprobante];

-- DropTable
DROP TABLE [dbo].[Localidad];

-- DropTable
DROP TABLE [dbo].[Persona];

-- DropTable
DROP TABLE [dbo].[Persona_Cliente];

-- DropTable
DROP TABLE [dbo].[Persona_Empleado];

-- DropTable
DROP TABLE [dbo].[Proveedor];

-- DropTable
DROP TABLE [dbo].[Provincia];

-- DropTable
DROP TABLE [dbo].[Usuario];

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B61BBC64596] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[DetallePedido] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [PedidoId] BIGINT,
    [ArticuloId] BIGINT,
    [Codigo] VARCHAR(8000),
    [Descripcion] VARCHAR(8000),
    [Cantidad] INT NOT NULL,
    [Precio] DECIMAL(18,2) NOT NULL,
    [SubTotal] DECIMAL(18,2) NOT NULL,
    [EstaEliminado] BIT CONSTRAINT [DF__DetallePe__EstaE__18EBB532] DEFAULT 0,
    [PrecioCosto] DECIMAL(18,2) NOT NULL,
    [Dto] DECIMAL(18,2),
    CONSTRAINT [PK__DetalleP__3214EC075882C4F2] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Pedido] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [UserId] NVARCHAR(1000) NOT NULL,
    [Fecha] DATETIME,
    [SubTotal] DECIMAL(18,2),
    [Descuento] DECIMAL(18,2),
    [Total] DECIMAL(18,2),
    CONSTRAINT [PK__Pedido__3214EC07C4562EC0] PRIMARY KEY CLUSTERED ([Id])
);

-- AddForeignKey
ALTER TABLE [dbo].[DetallePedido] ADD CONSTRAINT [FK__DetallePe__Artic__07C12930] FOREIGN KEY ([ArticuloId]) REFERENCES [dbo].[Articulo]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DetallePedido] ADD CONSTRAINT [FK__DetallePe__Pedid__06CD04F7] FOREIGN KEY ([PedidoId]) REFERENCES [dbo].[Pedido]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Pedido] ADD CONSTRAINT [FK__Pedido__UserId__02FC7413] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
