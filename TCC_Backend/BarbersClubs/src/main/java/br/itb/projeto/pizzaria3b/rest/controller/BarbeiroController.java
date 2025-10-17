package br.itb.projeto.pizzaria3b.rest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.pizzaria3b.model.entity.Barbeiro;
import br.itb.projeto.pizzaria3b.model.repository.BarbeiroRepository;

@RestController
@RequestMapping("/api/barbeiros")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "*"})
public class BarbeiroController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private BarbeiroRepository barbeiroRepository;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listarBarbeiros() {
        try {
            // Buscar barbeiros com informações da barbearia usando SQL nativo
            String sql = "SELECT b.id, b.nome, b.email, b.biografia, b.especialidades, " +
                        "b.tempoExperiencia, b.mediaAvaliacao, b.disponibilidade, b.telefone, " +
                        "b.barbearia_id, ba.nome as barbearia_nome " +
                        "FROM Barbeiro b " +
                        "LEFT JOIN Barbearia ba ON b.barbearia_id = ba.id";
            
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> criarBarbeiro(@RequestBody Map<String, Object> barbeiroData) {
        try {
            // Usar SQL nativo para inserir barbeiro com barbearia_id
            String sql = "INSERT INTO Barbeiro (nome, email, senha, biografia, especialidades, " +
                        "tempoExperiencia, mediaAvaliacao, disponibilidade, telefone, barbearia_id) " +
                        "VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)";
            
            Object barbeariaId = barbeiroData.get("barbearia_id");
            Integer barbeariaIdInt = null;
            if (barbeariaId != null && !barbeariaId.toString().isEmpty()) {
                barbeariaIdInt = Integer.parseInt(barbeariaId.toString());
            }
            
            jdbcTemplate.update(sql,
                barbeiroData.get("nome"),
                barbeiroData.get("email"),
                barbeiroData.get("senha"),
                barbeiroData.get("biografia"),
                barbeiroData.get("especialidades"),
                barbeiroData.get("tempoExperiencia"),
                barbeiroData.get("disponibilidade"),
                barbeiroData.get("telefone"),
                barbeariaIdInt
            );
            
            return ResponseEntity.ok(Map.of("message", "Barbeiro criado com sucesso"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erro ao criar barbeiro: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarBarbeiro(@PathVariable Long id) {
        try {
            System.out.println("Tentando deletar barbeiro com ID: " + id);
            
            // Verificar se o barbeiro existe
            if (!barbeiroRepository.existsById(id)) {
                System.out.println("Barbeiro não encontrado com ID: " + id);
                return ResponseEntity.status(404).body(Map.of("message", "Barbeiro não encontrado"));
            }
            
            // Usar SQL direto para evitar problemas com chaves estrangeiras
            try {
                // Deletar agendamentos associados primeiro
                String deleteAgendamentosSql = "DELETE FROM Agendamento WHERE barbeiro_id = ?";
                int agendamentosDeleted = jdbcTemplate.update(deleteAgendamentosSql, id);
                System.out.println("Deletados " + agendamentosDeleted + " agendamentos associados ao barbeiro ID: " + id);
                
                // Deletar o barbeiro usando SQL direto
                String deleteBarbeiroSql = "DELETE FROM Barbeiro WHERE id = ?";
                int result = jdbcTemplate.update(deleteBarbeiroSql, id);
                
                if (result > 0) {
                    System.out.println("Barbeiro deletado com sucesso, ID: " + id);
                    return ResponseEntity.ok(Map.of("message", "Barbeiro deletado com sucesso"));
                } else {
                    System.out.println("Falha ao deletar barbeiro, ID: " + id);
                    return ResponseEntity.status(500).body(Map.of("error", "Falha ao deletar barbeiro"));
                }
            } catch (Exception e) {
                System.out.println("Erro ao executar SQL para deletar barbeiro: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(500).body(Map.of("error", "Erro ao deletar barbeiro: " + e.getMessage()));
            }
        } catch (Exception e) {
            System.out.println("Erro geral ao deletar barbeiro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erro ao deletar barbeiro: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarBarbeiro(@PathVariable Long id, @RequestBody Map<String, Object> barbeiroData) {
        try {
            System.out.println("Tentando atualizar barbeiro com ID: " + id);
            
            // Verificar se o barbeiro existe
            if (!barbeiroRepository.existsById(id)) {
                System.out.println("Barbeiro não encontrado com ID: " + id);
                return ResponseEntity.status(404).body(Map.of("message", "Barbeiro não encontrado"));
            }
            
            // Usar SQL nativo para atualizar barbeiro com barbearia_id
            String sql = "UPDATE Barbeiro SET nome = ?, biografia = ?, especialidades = ?, " +
                        "tempoExperiencia = ?, disponibilidade = ?, telefone = ?, barbearia_id = ? " +
                        "WHERE id = ?";
            
            Object barbeariaId = barbeiroData.get("barbearia_id");
            Integer barbeariaIdInt = null;
            if (barbeariaId != null && !barbeariaId.toString().isEmpty()) {
                barbeariaIdInt = Integer.parseInt(barbeariaId.toString());
            }
            
            jdbcTemplate.update(sql,
                barbeiroData.get("nome"),
                barbeiroData.get("biografia"),
                barbeiroData.get("especialidades"),
                barbeiroData.get("tempoExperiencia"),
                barbeiroData.get("disponibilidade"),
                barbeiroData.get("telefone"),
                barbeariaIdInt,
                id
            );
            
            System.out.println("Barbeiro atualizado com sucesso, ID: " + id);
            
            return ResponseEntity.ok(Map.of("message", "Barbeiro atualizado com sucesso"));
        } catch (Exception e) {
            System.out.println("Erro ao atualizar barbeiro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erro ao atualizar barbeiro: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String senha = credentials.get("senha");
            
            System.out.println("Tentativa de login de barbeiro: " + email);
            
            // Verificar se o barbeiro existe
            String sql = "SELECT id, nome, email FROM Barbeiro WHERE email = ? AND senha = ?";
            Map<String, Object> barbeiro = jdbcTemplate.queryForMap(sql, email, senha);
            
            if (barbeiro != null) {
                // Gerar token (simplificado)
                String token = "token-" + System.currentTimeMillis();
                
                // Criar resposta
                Map<String, Object> response = new HashMap<>();
                response.put("id", barbeiro.get("id"));
                response.put("nome", barbeiro.get("nome"));
                response.put("email", barbeiro.get("email"));
                response.put("tipo", "barbeiro");
                response.put("userType", "barbeiro");
                response.put("token", token);
                
                System.out.println("Login de barbeiro bem-sucedido: " + barbeiro.get("nome"));
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(Map.of("message", "Credenciais inválidas"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(Map.of("message", "Credenciais inválidas"));
        }
    }
}