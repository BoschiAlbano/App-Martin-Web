/*
  Warnings:

  - A unique constraint covering the columns `[Codigo]` on the table `Marca` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Codigo]` on the table `Rubro` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Marca] DROP CONSTRAINT [Marca_Descripcion_Codigo_key];

-- DropIndex
ALTER TABLE [dbo].[Rubro] DROP CONSTRAINT [Rubro_Descripcion_Codigo_key];

-- CreateIndex
ALTER TABLE [dbo].[Marca] ADD CONSTRAINT [Marca_Codigo_key] UNIQUE NONCLUSTERED ([Codigo]);

-- CreateIndex
ALTER TABLE [dbo].[Rubro] ADD CONSTRAINT [Rubro_Codigo_key] UNIQUE NONCLUSTERED ([Codigo]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
