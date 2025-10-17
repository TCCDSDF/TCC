USE bd_barbersclub
GO

-- Verificar se a coluna usuario_id já existe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Agendamento') AND name = 'usuario_id')
BEGIN
    -- Adicionar coluna usuario_id na tabela Agendamento
    ALTER TABLE Agendamento 
    ADD usuario_id INT;
    
    -- Criar foreign key para a tabela Cliente
    ALTER TABLE Agendamento
    ADD CONSTRAINT FK_Agendamento_Usuario
    FOREIGN KEY (usuario_id) REFERENCES Cliente(id);
    
    PRINT 'Coluna usuario_id adicionada com sucesso!'
END
ELSE
BEGIN
    PRINT 'Coluna usuario_id já existe!'
END

-- Atualizar registros existentes para ter um usuario_id válido
-- (assumindo que cliente_id e usuario_id são o mesmo)
UPDATE Agendamento 
SET usuario_id = cliente_id 
WHERE usuario_id IS NULL;

PRINT 'Registros atualizados com usuario_id!'

-- Verificar a estrutura da tabela
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Agendamento'
ORDER BY ORDINAL_POSITION;

GO