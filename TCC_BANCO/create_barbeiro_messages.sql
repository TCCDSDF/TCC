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