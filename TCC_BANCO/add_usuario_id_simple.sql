USE bd_barbersclub
GO

-- Adicionar coluna usuario_id na tabela Agendamento
ALTER TABLE Agendamento 
ADD usuario_id INT;

-- Atualizar todos os registros existentes
UPDATE Agendamento 
SET usuario_id = cliente_id;

-- Adicionar foreign key
ALTER TABLE Agendamento
ADD CONSTRAINT FK_Agendamento_Usuario
FOREIGN KEY (usuario_id) REFERENCES Cliente(id);

-- Verificar se funcionou
SELECT TOP 5 id, cliente_id, usuario_id, dataAgendamento 
FROM Agendamento;

GO