-- Admin table
CREATE TABLE Admin (
  id INTEGER PRIMARY KEY IDENTITY,
  nome VARCHAR(149) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(25) NOT NULL
);

-- Barbershop table with RazorMap fields
CREATE TABLE Barbearia (
  id INT PRIMARY KEY IDENTITY,
  nome VARCHAR(50) NOT NULL, 
  descricao VARCHAR(500), 
  endereco VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  horarioAbertura TIME DEFAULT '09:00',
  horarioFechamento TIME DEFAULT '20:00',
  diasFuncionamento VARCHAR(100) DEFAULT 'Segunda a Sábado',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  fotoBarbearia VARCHAR(MAX),
  ativo BIT DEFAULT 1,
  parceira BIT DEFAULT 0,
  dataParceria DATETIME,
  planoAssinatura VARCHAR(20) DEFAULT 'Básico',
  admin_id INT, 
  FOREIGN KEY (admin_id) REFERENCES Admin(id)
);
 
-- Barbers table
CREATE TABLE Barbeiro (
  id INT PRIMARY KEY IDENTITY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(25) NOT NULL,
  biografia VARCHAR(512),
  especialidades VARCHAR(500),
  tempoExperiencia INT DEFAULT 0,
  mediaAvaliacao DECIMAL(3,2) DEFAULT 0,
  disponibilidade BIT DEFAULT 1,
  horarioInicial TIME DEFAULT '09:00',
  horarioFinal TIME DEFAULT '18:00',
  criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm DATETIME DEFAULT CURRENT_TIMESTAMP, 
  barbearia_id INTEGER, 
  telefone VARCHAR(20),
  FOREIGN KEY (barbearia_id) REFERENCES Barbearia(id)
);

-- Client table
CREATE TABLE Cliente (
  id INTEGER PRIMARY KEY IDENTITY,
  nome VARCHAR(149) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(25) NOT NULL,
  nivelFidelidade VARCHAR(10), 
  telefone VARCHAR(15),
  fotoPerfil VARBINARY(MAX),
  criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE Servico (
  id INTEGER PRIMARY KEY IDENTITY,
  nome VARCHAR(50) NOT NULL,
  descricao VARCHAR(255),
  duracao INTEGER NOT NULL,
  preco DECIMAL(5,2) NOT NULL,
  foto VARBINARY(MAX),
  image_url VARCHAR(MAX),
  categoria VARCHAR(20) CHECK(categoria IN ('Corte de cabelo', 'Barba', 'Combo', 'Especial')) DEFAULT 'Corte de cabelo',
  pontosGanhos INT DEFAULT 0,
  ativo BIT DEFAULT 1
);

-- Appointments table
CREATE TABLE Agendamento (
  id INT PRIMARY KEY IDENTITY,
  dataAgendamento DATETIME NOT NULL,
  statusAgendamento VARCHAR(50), 
  descricao VARCHAR(500),
  criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
  cliente_id INT NOT NULL,
  barbeiro_id INT NOT NULL,
  servico_id INT NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES Cliente(id),
  FOREIGN KEY (barbeiro_id) REFERENCES Barbeiro(id),
  FOREIGN KEY (servico_id) REFERENCES Servico(id)
);

-- Fidelity points table
CREATE TABLE PontosFidelidade (
  id INTEGER PRIMARY KEY IDENTITY,
  pontos INTEGER NOT NULL,
  tipoTransacao VARCHAR(50), 
  descricao VARCHAR(500),
  criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
  referencia_id INT,
  cliente_id INTEGER NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
);

-- Chat messages table
CREATE TABLE MensagensChat (
  id INTEGER PRIMARY KEY IDENTITY,
  mensagem VARCHAR(255) NOT NULL,
  lida BIT DEFAULT 0,
  mensagemBot BIT DEFAULT 0,
  iniciadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
  remetente_id INTEGER NOT NULL,
  destinatario_id INTEGER NOT NULL,
  FOREIGN KEY (remetente_id) REFERENCES Cliente(id),
  FOREIGN KEY (destinatario_id) REFERENCES Admin(id)
);

-- Barbershop ratings table for RazorMap
CREATE TABLE AvaliacaoBarbearia (
  id INT PRIMARY KEY IDENTITY,
  nota DECIMAL(3,2) NOT NULL,
  comentario VARCHAR(500),
  dataAvaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  cliente_id INT NOT NULL,
  barbearia_id INT NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES Cliente(id),
  FOREIGN KEY (barbearia_id) REFERENCES Barbearia(id)
);

-- Insert sample data

-- ADMINS
INSERT INTO Admin (nome, email, senha) 
VALUES
('Admin Master', 'admin@gmail.com', '@Admin123');

-- Stored procedures para o RazorMap

-- Listar todas as barbearias
CREATE OR ALTER PROCEDURE sp_ListarBarbearias
AS
BEGIN
    SELECT b.*, 
           (SELECT AVG(nota) FROM AvaliacaoBarbearia WHERE barbearia_id = b.id) as mediaAvaliacao
    FROM Barbearia b
    ORDER BY b.nome
END
GO

-- Listar barbearias parceiras ativas
CREATE OR ALTER PROCEDURE sp_ListarBarbeariasParcerias
AS
BEGIN
    SELECT b.*, 
           (SELECT AVG(nota) FROM AvaliacaoBarbearia WHERE barbearia_id = b.id) as mediaAvaliacao
    FROM Barbearia b
    WHERE b.parceira = 1 AND b.ativo = 1
    ORDER BY b.nome
END
GO

-- Buscar barbearia por ID
CREATE OR ALTER PROCEDURE sp_BuscarBarbeariaPorId
    @id INT
AS
BEGIN
    SELECT b.*, 
           (SELECT AVG(nota) FROM AvaliacaoBarbearia WHERE barbearia_id = b.id) as mediaAvaliacao
    FROM Barbearia b
    WHERE b.id = @id
END
GO

-- Buscar barbearias próximas por coordenadas
CREATE OR ALTER PROCEDURE sp_BuscarBarbeariasPorLocalizacao
    @latitude DECIMAL(10, 8),
    @longitude DECIMAL(11, 8),
    @raio INT = 10 -- raio em km
AS
BEGIN
    -- Fórmula de Haversine para calcular distância entre coordenadas
    SELECT b.*,
           (SELECT AVG(nota) FROM AvaliacaoBarbearia WHERE barbearia_id = b.id) as mediaAvaliacao,
           (6371 * ACOS(COS(RADIANS(@latitude)) * COS(RADIANS(b.latitude)) * COS(RADIANS(b.longitude) - RADIANS(@longitude)) + SIN(RADIANS(@latitude)) * SIN(RADIANS(b.latitude)))) AS distancia
    FROM Barbearia b
    WHERE b.parceira = 1 AND b.ativo = 1
          AND (6371 * ACOS(COS(RADIANS(@latitude)) * COS(RADIANS(b.latitude)) * COS(RADIANS(b.longitude) - RADIANS(@longitude)) + SIN(RADIANS(@latitude)) * SIN(RADIANS(b.latitude)))) <= @raio
    ORDER BY distancia
END

GO

USE bd_barbersclub
GO

-- Criar tabela para mensagens de barbeiros
CREATE TABLE MensagensBarbeiro (
  id INTEGER PRIMARY KEY IDENTITY,
  mensagem VARCHAR(255) NOT NULL,
  lida BIT DEFAULT 0,
  mensagemBot BIT DEFAULT 0,
  iniciadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
  barbeiro_id INTEGER NOT NULL,
  admin_id INTEGER NOT NULL,
  remetente_tipo VARCHAR(10) NOT NULL, -- 'barbeiro' ou 'admin'
  FOREIGN KEY (barbeiro_id) REFERENCES Barbeiro(id),
  FOREIGN KEY (admin_id) REFERENCES Admin(id)
);

GO

-- Verificar dados inseridos
SELECT * FROM Admin;
SELECT * FROM Barbearia;
SELECT * FROM Barbeiro;
SELECT * FROM Cliente;
SELECT * FROM Servico;
SELECT * FROM Agendamento;
SELECT * FROM PontosFidelidade;
SELECT * FROM MensagensChat;
SELECT * FROM AvaliacaoBarbearia;



ALTER TABLE Servico
ADD barbearia_id INT,
    FOREIGN KEY (barbearia_id) REFERENCES Barbearia(id);

USE bd_barbersclub
GO

-- Adicionar coluna usuario_id na tabela Agendamento
ALTER TABLE Agendamento 
ADD usuario_id INT;

-- Criar foreign key para a tabela Cliente (assumindo que usuario_id referencia Cliente)
ALTER TABLE Agendamento
ADD CONSTRAINT FK_Agendamento_Usuario
FOREIGN KEY (usuario_id) REFERENCES Cliente(id);

-- Atualizar registros existentes para ter um usuario_id válido
-- (assumindo que cliente_id e usuario_id são o mesmo para agendamentos existentes)
UPDATE Agendamento 
SET usuario_id = cliente_id 
WHERE usuario_id IS NULL;

GO