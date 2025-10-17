USE bd_barbersclub;

-- Adicionar coluna barbearia_id na tabela Servico
ALTER TABLE Servico 
ADD barbearia_id INT;

-- Adicionar chave estrangeira
ALTER TABLE Servico 
ADD CONSTRAINT FK_Servico_Barbearia 
FOREIGN KEY (barbearia_id) REFERENCES Barbearia(id);

-- Atualizar campo telefone na tabela Barbeiro se não existir
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Barbeiro' AND COLUMN_NAME = 'telefone')
BEGIN
    ALTER TABLE Barbeiro ADD telefone VARCHAR(20);
END

GO