BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[__MigrationHistory] (
    [MigrationId] NVARCHAR(150) NOT NULL,
    [ContextKey] NVARCHAR(300) NOT NULL,
    [Model] VARBINARY(max) NOT NULL,
    [ProductVersion] NVARCHAR(32) NOT NULL,
    CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY CLUSTERED ([MigrationId],[ContextKey])
);

-- CreateTable
CREATE TABLE [dbo].[Articulo] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [MarcaId] BIGINT NOT NULL,
    [RubroId] BIGINT NOT NULL,
    [Codigo] INT NOT NULL,
    [CodigoBarra] VARCHAR(8000),
    [Abreviatura] VARCHAR(8000),
    [Descripcion] VARCHAR(8000),
    [Detalle] VARCHAR(8000),
    [Ubicacion] VARCHAR(8000),
    [Stock] INT NOT NULL,
    [PrecioCosto] DECIMAL(18,2) NOT NULL,
    [PrecioVenta] DECIMAL(18,2) NOT NULL,
    [PorcentajeGanancia] DECIMAL(18,2) NOT NULL,
    [Foto] VARBINARY(max),
    [StockMinimo] DECIMAL(18,2) NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    [PermiteStockNegativo] BIT NOT NULL CONSTRAINT [DF__Articulo__Permit__70DDC3D8] DEFAULT 0,
    CONSTRAINT [PK_dbo.Articulo] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Caja] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [Efectivo] DECIMAL(18,2) NOT NULL,
    [CuentaCorriente] DECIMAL(18,2) NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Caja] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Comprobante] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [EmpleadoId] BIGINT NOT NULL,
    [UsuarioId] BIGINT NOT NULL,
    [Fecha] DATETIME NOT NULL,
    [Numero] INT NOT NULL,
    [SubTotal] DECIMAL(18,2) NOT NULL,
    [Descuento] DECIMAL(18,2) NOT NULL,
    [Total] DECIMAL(18,2) NOT NULL,
    [TipoComprobante] INT NOT NULL,
    [Efectivo] DECIMAL(18,2) NOT NULL,
    [CuentaCorriente] DECIMAL(18,2) NOT NULL,
    [Estado] INT NOT NULL,
    [ClienteId] BIGINT NOT NULL,
    [PagoCuentaCorriente] BIT NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Comprobante] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Configuracion] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [RazonSocial] VARCHAR(8000),
    [NombreFantasia] VARCHAR(8000),
    [Cuit] VARCHAR(8000),
    [Telefono] VARCHAR(8000),
    [Celular] VARCHAR(8000),
    [Direccion] VARCHAR(8000),
    [Email] VARCHAR(8000),
    [LocalidadId] BIGINT NOT NULL,
    [PuestoCajaSeparado] BIT NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Configuracion] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Departamento] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [ProvinciaId] BIGINT NOT NULL,
    [Descripcion] VARCHAR(8000),
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Departamento] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[DetalleComprobante] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [ComprobanteId] BIGINT NOT NULL,
    [ArticuloId] BIGINT NOT NULL,
    [Codigo] VARCHAR(8000),
    [Descripcion] VARCHAR(8000),
    [Cantidad] INT NOT NULL,
    [Precio] DECIMAL(18,2) NOT NULL,
    [SubTotal] DECIMAL(18,2) NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    [PrecioCosto] DECIMAL(18,2) NOT NULL CONSTRAINT [DF__DetalleCo__Preci__71D1E811] DEFAULT 0,
    [Dto] DECIMAL(18,2),
    CONSTRAINT [PK_dbo.DetalleComprobante] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Localidad] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [DepartamentoId] BIGINT NOT NULL,
    [Descripcion] VARCHAR(8000),
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Localidad] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Marca] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [Descripcion] VARCHAR(8000),
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Marca] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Persona] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [Apellido] VARCHAR(8000),
    [Nombre] VARCHAR(8000),
    [Dni] VARCHAR(8000),
    [Direccion] VARCHAR(8000),
    [Telefono] VARCHAR(8000),
    [Mail] VARCHAR(8000),
    [LocalidadId] BIGINT NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Persona] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Persona_Cliente] (
    [Id] BIGINT NOT NULL,
    [ActivarCtaCte] BIT NOT NULL,
    [TieneLimiteCompra] BIT NOT NULL,
    [MontoMaximoCtaCte] DECIMAL(18,2) NOT NULL,
    [Deuda] DECIMAL(18,2) NOT NULL CONSTRAINT [DF__Persona_C__Deuda__72C60C4A] DEFAULT 0,
    CONSTRAINT [PK_dbo.Persona_Cliente] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Persona_Empleado] (
    [Id] BIGINT NOT NULL,
    [Legajo] INT NOT NULL,
    [Foto] VARBINARY(max),
    CONSTRAINT [PK_dbo.Persona_Empleado] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Proveedor] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [RazonSocial] VARCHAR(8000),
    [CUIT] VARCHAR(8000),
    [Direccion] VARCHAR(8000),
    [Telefono] VARCHAR(8000),
    [Mail] VARCHAR(8000),
    [LocalidadId] BIGINT NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Proveedor] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Provincia] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [Descripcion] VARCHAR(8000),
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Provincia] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Rubro] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [Descripcion] VARCHAR(8000),
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Rubro] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [EmpleadoId] BIGINT NOT NULL,
    [Nombre] VARCHAR(8000),
    [Password] VARCHAR(8000),
    [EstaBloqueado] BIT NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Usuario] PRIMARY KEY CLUSTERED ([Id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [FK_dbo.Articulo_dbo.Marca_MarcaId] FOREIGN KEY ([MarcaId]) REFERENCES [dbo].[Marca]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [FK_dbo.Articulo_dbo.Rubro_RubroId] FOREIGN KEY ([RubroId]) REFERENCES [dbo].[Rubro]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Comprobante] ADD CONSTRAINT [FK_dbo.Comprobante_dbo.Persona_Cliente_ClienteId] FOREIGN KEY ([ClienteId]) REFERENCES [dbo].[Persona_Cliente]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Comprobante] ADD CONSTRAINT [FK_dbo.Comprobante_dbo.Persona_Empleado_EmpleadoId] FOREIGN KEY ([EmpleadoId]) REFERENCES [dbo].[Persona_Empleado]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Comprobante] ADD CONSTRAINT [FK_dbo.Comprobante_dbo.Usuario_UsuarioId] FOREIGN KEY ([UsuarioId]) REFERENCES [dbo].[Usuario]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Configuracion] ADD CONSTRAINT [FK_dbo.Configuracion_dbo.Localidad_LocalidadId] FOREIGN KEY ([LocalidadId]) REFERENCES [dbo].[Localidad]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Departamento] ADD CONSTRAINT [FK_dbo.Departamento_dbo.Provincia_ProvinciaId] FOREIGN KEY ([ProvinciaId]) REFERENCES [dbo].[Provincia]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DetalleComprobante] ADD CONSTRAINT [FK_dbo.DetalleComprobante_dbo.Articulo_ArticuloId] FOREIGN KEY ([ArticuloId]) REFERENCES [dbo].[Articulo]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DetalleComprobante] ADD CONSTRAINT [FK_dbo.DetalleComprobante_dbo.Comprobante_ComprobanteId] FOREIGN KEY ([ComprobanteId]) REFERENCES [dbo].[Comprobante]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Localidad] ADD CONSTRAINT [FK_dbo.Localidad_dbo.Departamento_DepartamentoId] FOREIGN KEY ([DepartamentoId]) REFERENCES [dbo].[Departamento]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Persona] ADD CONSTRAINT [FK_dbo.Persona_dbo.Localidad_LocalidadId] FOREIGN KEY ([LocalidadId]) REFERENCES [dbo].[Localidad]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Persona_Cliente] ADD CONSTRAINT [FK_dbo.Persona_Cliente_dbo.Persona_Id] FOREIGN KEY ([Id]) REFERENCES [dbo].[Persona]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Persona_Empleado] ADD CONSTRAINT [FK_dbo.Persona_Empleado_dbo.Persona_Id] FOREIGN KEY ([Id]) REFERENCES [dbo].[Persona]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Proveedor] ADD CONSTRAINT [FK_dbo.Proveedor_dbo.Localidad_LocalidadId] FOREIGN KEY ([LocalidadId]) REFERENCES [dbo].[Localidad]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [FK_dbo.Usuario_dbo.Persona_Empleado_EmpleadoId] FOREIGN KEY ([EmpleadoId]) REFERENCES [dbo].[Persona_Empleado]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
