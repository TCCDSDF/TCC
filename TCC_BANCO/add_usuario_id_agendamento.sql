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