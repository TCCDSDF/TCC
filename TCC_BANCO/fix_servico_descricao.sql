USE bd_barbersclub
GO

-- Aumentar o tamanho da coluna descricao na tabela Servico
ALTER TABLE Servico 
ALTER COLUMN descricao VARCHAR(1000);

-- Verificar a alteração
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Servico' AND COLUMN_NAME = 'descricao';

GO