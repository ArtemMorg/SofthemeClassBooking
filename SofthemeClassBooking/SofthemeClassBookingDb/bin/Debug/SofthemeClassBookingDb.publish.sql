﻿/*
Скрипт развертывания для SofthemeClassBookingDatabase

Этот код был создан программным средством.
Изменения, внесенные в этот файл, могут привести к неверному выполнению кода и будут потеряны
в случае его повторного формирования.
*/

GO
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL, QUOTED_IDENTIFIER ON;

SET NUMERIC_ROUNDABORT OFF;


GO
:setvar DatabaseName "SofthemeClassBookingDatabase"
:setvar DefaultFilePrefix "SofthemeClassBookingDatabase"
:setvar DefaultDataPath "C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\"
:setvar DefaultLogPath "C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\"

GO
:on error exit
GO
/*
Проверьте режим SQLCMD и отключите выполнение скрипта, если режим SQLCMD не поддерживается.
Чтобы повторно включить скрипт после включения режима SQLCMD выполните следующую инструкцию:
SET NOEXEC OFF; 
*/
:setvar __IsSqlCmdEnabled "True"
GO
IF N'$(__IsSqlCmdEnabled)' NOT LIKE N'True'
    BEGIN
        PRINT N'Для успешного выполнения этого скрипта должен быть включен режим SQLCMD.';
        SET NOEXEC ON;
    END


GO
USE [master];


GO

IF (DB_ID(N'$(DatabaseName)') IS NOT NULL) 
BEGIN
    ALTER DATABASE [$(DatabaseName)]
    SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [$(DatabaseName)];
END

GO
PRINT N'Выполняется создание $(DatabaseName)...'
GO
CREATE DATABASE [$(DatabaseName)]
    ON 
    PRIMARY(NAME = [$(DatabaseName)], FILENAME = N'$(DefaultDataPath)$(DefaultFilePrefix)_Primary.mdf')
    LOG ON (NAME = [$(DatabaseName)_log], FILENAME = N'$(DefaultLogPath)$(DefaultFilePrefix)_Primary.ldf') COLLATE SQL_Latin1_General_CP1_CI_AS
GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET ANSI_NULLS ON,
                ANSI_PADDING ON,
                ANSI_WARNINGS ON,
                ARITHABORT ON,
                CONCAT_NULL_YIELDS_NULL ON,
                NUMERIC_ROUNDABORT OFF,
                QUOTED_IDENTIFIER ON,
                ANSI_NULL_DEFAULT ON,
                CURSOR_DEFAULT LOCAL,
                RECOVERY FULL,
                CURSOR_CLOSE_ON_COMMIT OFF,
                AUTO_CREATE_STATISTICS ON,
                AUTO_SHRINK OFF,
                AUTO_UPDATE_STATISTICS ON,
                RECURSIVE_TRIGGERS OFF 
            WITH ROLLBACK IMMEDIATE;
        ALTER DATABASE [$(DatabaseName)]
            SET AUTO_CLOSE OFF 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET ALLOW_SNAPSHOT_ISOLATION OFF;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET READ_COMMITTED_SNAPSHOT OFF 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET AUTO_UPDATE_STATISTICS_ASYNC OFF,
                PAGE_VERIFY NONE,
                DATE_CORRELATION_OPTIMIZATION OFF,
                DISABLE_BROKER,
                PARAMETERIZATION SIMPLE,
                SUPPLEMENTAL_LOGGING OFF 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF IS_SRVROLEMEMBER(N'sysadmin') = 1
    BEGIN
        IF EXISTS (SELECT 1
                   FROM   [master].[dbo].[sysdatabases]
                   WHERE  [name] = N'$(DatabaseName)')
            BEGIN
                EXECUTE sp_executesql N'ALTER DATABASE [$(DatabaseName)]
    SET TRUSTWORTHY OFF,
        DB_CHAINING OFF 
    WITH ROLLBACK IMMEDIATE';
            END
    END
ELSE
    BEGIN
        PRINT N'Параметры базы данных изменить нельзя. Применить эти параметры может только пользователь SysAdmin.';
    END


GO
IF IS_SRVROLEMEMBER(N'sysadmin') = 1
    BEGIN
        IF EXISTS (SELECT 1
                   FROM   [master].[dbo].[sysdatabases]
                   WHERE  [name] = N'$(DatabaseName)')
            BEGIN
                EXECUTE sp_executesql N'ALTER DATABASE [$(DatabaseName)]
    SET HONOR_BROKER_PRIORITY OFF 
    WITH ROLLBACK IMMEDIATE';
            END
    END
ELSE
    BEGIN
        PRINT N'Параметры базы данных изменить нельзя. Применить эти параметры может только пользователь SysAdmin.';
    END


GO
ALTER DATABASE [$(DatabaseName)]
    SET TARGET_RECOVERY_TIME = 0 SECONDS 
    WITH ROLLBACK IMMEDIATE;


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET FILESTREAM(NON_TRANSACTED_ACCESS = OFF),
                CONTAINMENT = NONE 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET AUTO_CREATE_STATISTICS ON(INCREMENTAL = OFF),
                MEMORY_OPTIMIZED_ELEVATE_TO_SNAPSHOT = OFF,
                DELAYED_DURABILITY = DISABLED 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET QUERY_STORE (QUERY_CAPTURE_MODE = ALL, FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_PLANS_PER_QUERY = 200, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 367), MAX_STORAGE_SIZE_MB = 100) 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE [$(DatabaseName)]
            SET QUERY_STORE = OFF 
            WITH ROLLBACK IMMEDIATE;
    END


GO
IF EXISTS (SELECT 1
           FROM   [master].[dbo].[sysdatabases]
           WHERE  [name] = N'$(DatabaseName)')
    BEGIN
        ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
        ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
        ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
        ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
        ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
        ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
        ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
        ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
    END


GO
USE [$(DatabaseName)];


GO
IF fulltextserviceproperty(N'IsFulltextInstalled') = 1
    EXECUTE sp_fulltext_database 'enable';


GO
PRINT N'Выполняется создание [dbo].[AspNetRoles]...';


GO
CREATE TABLE [dbo].[AspNetRoles] (
    [Id]   NVARCHAR (128) NOT NULL,
    [Name] NVARCHAR (256) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED ([Id] ASC) ON [PRIMARY]
) ON [PRIMARY];


GO
PRINT N'Выполняется создание [dbo].[AspNetUserClaims]...';


GO
CREATE TABLE [dbo].[AspNetUserClaims] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [UserId]     NVARCHAR (128) NOT NULL,
    [ClaimType]  NVARCHAR (MAX) NULL,
    [ClaimValue] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED ([Id] ASC) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];


GO
PRINT N'Выполняется создание [dbo].[AspNetUserLogins]...';


GO
CREATE TABLE [dbo].[AspNetUserLogins] (
    [LoginProvider] NVARCHAR (128) NOT NULL,
    [ProviderKey]   NVARCHAR (128) NOT NULL,
    [UserId]        NVARCHAR (128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED ([LoginProvider] ASC, [ProviderKey] ASC, [UserId] ASC) ON [PRIMARY]
) ON [PRIMARY];


GO
PRINT N'Выполняется создание [dbo].[AspNetUserRoles]...';


GO
CREATE TABLE [dbo].[AspNetUserRoles] (
    [UserId] NVARCHAR (128) NOT NULL,
    [RoleId] NVARCHAR (128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC) ON [PRIMARY]
) ON [PRIMARY];


GO
PRINT N'Выполняется создание [dbo].[AspNetUsers]...';


GO
CREATE TABLE [dbo].[AspNetUsers] (
    [Id]                   NVARCHAR (128) NOT NULL,
    [Email]                NVARCHAR (256) NULL,
    [EmailConfirmed]       BIT            NOT NULL,
    [PasswordHash]         NVARCHAR (MAX) NULL,
    [SecurityStamp]        NVARCHAR (MAX) NULL,
    [PhoneNumber]          NVARCHAR (MAX) NULL,
    [PhoneNumberConfirmed] BIT            NOT NULL,
    [TwoFactorEnabled]     BIT            NOT NULL,
    [LockoutEndDateUtc]    DATETIME       NULL,
    [LockoutEnabled]       BIT            NOT NULL,
    [AccessFailedCount]    INT            NOT NULL,
    [UserName]             NVARCHAR (256) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED ([Id] ASC) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];


GO
PRINT N'Выполняется создание [dbo].[ClassRoom]...';


GO
CREATE TABLE [dbo].[ClassRoom] (
    [Id]                 INT           IDENTITY (1, 1) NOT NULL,
    [Name]               NVARCHAR (30) NOT NULL,
    [Roominess]          TINYINT       NULL,
    [QuantityOfBoards]   TINYINT       NULL,
    [QuantityOfPrinters] TINYINT       NULL,
    [QuantityOfTables]   TINYINT       NULL,
    [QuantityOfLaptops]  TINYINT       NULL,
    [IsLocked]           BIT           NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Выполняется создание [dbo].[Event]...';


GO
CREATE TABLE [dbo].[Event] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [Title]         NVARCHAR (100) NOT NULL,
    [AuthorId]      NVARCHAR (128) NOT NULL,
    [ClassRoomId]   INT            NOT NULL,
    [Organizer]     NVARCHAR (50)  NULL,
    [BeginingDate]  DATETIME       NOT NULL,
    [EndingDate]    DATETIME       NOT NULL,
    [Description]   NVARCHAR (200) NULL,
    [IsPublic]      BIT            NULL,
    [IsAuthorShown] BIT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Выполняется создание [dbo].[Feedback]...';


GO
CREATE TABLE [dbo].[Feedback] (
    [Id]   INT             IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR (50)   NOT NULL,
    [Text] NVARCHAR (3000) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Выполняется создание [dbo].[Participant]...';


GO
CREATE TABLE [dbo].[Participant] (
    [Id]      INT           IDENTITY (1, 1) NOT NULL,
    [Name]    NVARCHAR (60) NOT NULL,
    [EventId] INT           NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Выполняется создание ограничение без названия для [dbo].[ClassRoom]...';


GO
ALTER TABLE [dbo].[ClassRoom]
    ADD DEFAULT 0 FOR [Roominess];


GO
PRINT N'Выполняется создание ограничение без названия для [dbo].[ClassRoom]...';


GO
ALTER TABLE [dbo].[ClassRoom]
    ADD DEFAULT 0 FOR [QuantityOfBoards];


GO
PRINT N'Выполняется создание ограничение без названия для [dbo].[ClassRoom]...';


GO
ALTER TABLE [dbo].[ClassRoom]
    ADD DEFAULT 0 FOR [QuantityOfPrinters];


GO
PRINT N'Выполняется создание ограничение без названия для [dbo].[ClassRoom]...';


GO
ALTER TABLE [dbo].[ClassRoom]
    ADD DEFAULT 0 FOR [QuantityOfTables];


GO
PRINT N'Выполняется создание ограничение без названия для [dbo].[ClassRoom]...';


GO
ALTER TABLE [dbo].[ClassRoom]
    ADD DEFAULT 0 FOR [QuantityOfLaptops];


GO
PRINT N'Выполняется создание ограничение без названия для [dbo].[ClassRoom]...';


GO
ALTER TABLE [dbo].[ClassRoom]
    ADD DEFAULT 0 FOR [IsLocked];


GO
PRINT N'Выполняется создание ограничение без названия для [dbo].[Event]...';


GO
ALTER TABLE [dbo].[Event]
    ADD DEFAULT 1 FOR [IsPublic];


GO
PRINT N'Выполняется создание ограничение без названия для [dbo].[Event]...';


GO
ALTER TABLE [dbo].[Event]
    ADD DEFAULT 1 FOR [IsAuthorShown];


GO
PRINT N'Выполняется создание [dbo].[FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId]...';


GO
ALTER TABLE [dbo].[AspNetUserClaims]
    ADD CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;


GO
PRINT N'Выполняется создание [dbo].[FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId]...';


GO
ALTER TABLE [dbo].[AspNetUserLogins]
    ADD CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;


GO
PRINT N'Выполняется создание [dbo].[FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId]...';


GO
ALTER TABLE [dbo].[AspNetUserRoles]
    ADD CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE;


GO
PRINT N'Выполняется создание [dbo].[FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId]...';


GO
ALTER TABLE [dbo].[AspNetUserRoles]
    ADD CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE;


GO
PRINT N'Выполняется создание [dbo].[FK_Event_User]...';


GO
ALTER TABLE [dbo].[Event]
    ADD CONSTRAINT [FK_Event_User] FOREIGN KEY ([AuthorId]) REFERENCES [dbo].[AspNetUsers] ([Id]);


GO
PRINT N'Выполняется создание [dbo].[FK_Event_Room]...';


GO
ALTER TABLE [dbo].[Event]
    ADD CONSTRAINT [FK_Event_Room] FOREIGN KEY ([ClassRoomId]) REFERENCES [dbo].[ClassRoom] ([Id]);


GO
PRINT N'Выполняется создание [dbo].[FK_Participant_Event]...';


GO
ALTER TABLE [dbo].[Participant]
    ADD CONSTRAINT [FK_Participant_Event] FOREIGN KEY ([EventId]) REFERENCES [dbo].[Event] ([Id]);


GO
DECLARE @VarDecimalSupported AS BIT;

SELECT @VarDecimalSupported = 0;

IF ((ServerProperty(N'EngineEdition') = 3)
    AND (((@@microsoftversion / power(2, 24) = 9)
          AND (@@microsoftversion & 0xffff >= 3024))
         OR ((@@microsoftversion / power(2, 24) = 10)
             AND (@@microsoftversion & 0xffff >= 1600))))
    SELECT @VarDecimalSupported = 1;

IF (@VarDecimalSupported > 0)
    BEGIN
        EXECUTE sp_db_vardecimal_storage_format N'$(DatabaseName)', 'ON';
    END


GO
PRINT N'Обновление завершено.';


GO
