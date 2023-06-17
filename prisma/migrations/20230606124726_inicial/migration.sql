BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [provider] NVARCHAR(1000) NOT NULL,
    [providerAccountId] NVARCHAR(1000) NOT NULL,
    [refresh_token] TEXT,
    [access_token] TEXT,
    [expires_at] INT,
    [token_type] NVARCHAR(1000),
    [scope] NVARCHAR(1000),
    [id_token] TEXT,
    [session_state] NVARCHAR(1000),
    CONSTRAINT [Account_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Account_provider_providerAccountId_key] UNIQUE NONCLUSTERED ([provider],[providerAccountId])
);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] NVARCHAR(1000) NOT NULL,
    [sessionToken] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [Session_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Session_sessionToken_key] UNIQUE NONCLUSTERED ([sessionToken])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [emailVerified] DATETIME2,
    [image] NVARCHAR(1000),
    [password] TEXT,
    [apellido] NVARCHAR(1000),
    [DNI] NVARCHAR(100),
    [telefono] NVARCHAR(100),
    [direccion] NVARCHAR(100),
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[VerificationToken] (
    [identifier] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [VerificationToken_token_key] UNIQUE NONCLUSTERED ([token]),
    CONSTRAINT [VerificationToken_identifier_token_key] UNIQUE NONCLUSTERED ([identifier],[token])
);

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
    [Descripcion] VARCHAR(8000) NOT NULL,
    [Stock] INT NOT NULL,
    [PrecioVenta] DECIMAL(18,2) NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    [PermiteStockNegativo] BIT NOT NULL CONSTRAINT [DF__Articulo__Permit__6383C8BA] DEFAULT 0,
    [FotoUrl] NVARCHAR(max),
    CONSTRAINT [PK_dbo.Articulo] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [Articulo_Codigo_key] UNIQUE NONCLUSTERED ([Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[Marca] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [Codigo] INT NOT NULL,
    [Descripcion] VARCHAR(8000) NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Marca] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [Marca_Descripcion_Codigo_key] UNIQUE NONCLUSTERED ([Descripcion],[Codigo])
);

-- CreateTable
CREATE TABLE [dbo].[Rubro] (
    [Id] BIGINT NOT NULL IDENTITY(1,1),
    [Codigo] INT NOT NULL,
    [Descripcion] VARCHAR(8000) NOT NULL,
    [EstaEliminado] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Rubro] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [Rubro_Descripcion_Codigo_key] UNIQUE NONCLUSTERED ([Descripcion],[Codigo])
);

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
    [Estado] BIT,
    CONSTRAINT [PK__Pedido__3214EC07C4562EC0] PRIMARY KEY CLUSTERED ([Id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Account] ADD CONSTRAINT [Account_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [FK_dbo.Articulo_dbo.Marca_MarcaId] FOREIGN KEY ([MarcaId]) REFERENCES [dbo].[Marca]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Articulo] ADD CONSTRAINT [FK_dbo.Articulo_dbo.Rubro_RubroId] FOREIGN KEY ([RubroId]) REFERENCES [dbo].[Rubro]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
