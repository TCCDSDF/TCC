package br.itb.projeto.pizzaria3b.rest.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "*"})
public class ChatController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private DataSource dataSource;

    @GetMapping("/clients")
    public ResponseEntity<?> getClients() {
        try {
            // Buscar clientes do banco usando SQL direto
            String sql = "SELECT id, nome as name, email FROM Cliente";
            List<Map<String, Object>> clientes = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao buscar clientes: " + e.getMessage());
        }
    }
    
    @GetMapping("/barbers")
    public ResponseEntity<?> getBarbers() {
        try {
            // Buscar todos os barbeiros
            String sql = "SELECT id, nome as name, email FROM Barbeiro";
            List<Map<String, Object>> barbeiros = jdbcTemplate.queryForList(sql);
            
            System.out.println("Encontrados " + barbeiros.size() + " barbeiros");
            
            return ResponseEntity.ok(barbeiros);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao buscar barbeiros: " + e.getMessage());
        }
    }
    
    @GetMapping("/admin-messages/{barberId}")
    public ResponseEntity<?> getAdminMessages(@PathVariable Integer barberId) {
        try {
            // Buscar mensagens entre admin e barbeiro na tabela MensagensBarbeiro
            String sql = "SELECT id, mensagem as message, " +
                       "CASE WHEN remetente_tipo = 'barbeiro' THEN barbeiro_id ELSE admin_id END as sender_id, " +
                       "CASE WHEN remetente_tipo = 'barbeiro' THEN admin_id ELSE barbeiro_id END as receiver_id, " +
                       "iniciadoEm as created_at, lida as is_read " +
                       "FROM MensagensBarbeiro WHERE barbeiro_id = ? ORDER BY iniciadoEm ASC";
                      
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, barberId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao buscar mensagens: " + e.getMessage());
        }
    }
    
    @GetMapping("/messages/{userId}")
    public ResponseEntity<?> getMessages(@PathVariable Integer userId) {
        try {
            // Verificar se é barbeiro
            String checkBarberSql = "SELECT COUNT(*) FROM Barbeiro WHERE id = ?";
            int isBarber = jdbcTemplate.queryForObject(checkBarberSql, Integer.class, userId);
            
            if (isBarber > 0) {
                // Buscar mensagens do barbeiro
                String sql = "SELECT id, mensagem as message, " +
                           "CASE WHEN remetente_tipo = 'barbeiro' THEN barbeiro_id ELSE admin_id END as sender_id, " +
                           "CASE WHEN remetente_tipo = 'barbeiro' THEN admin_id ELSE barbeiro_id END as receiver_id, " +
                           "iniciadoEm as created_at, lida as is_read " +
                           "FROM MensagensBarbeiro WHERE barbeiro_id = ? ORDER BY iniciadoEm ASC";
                           
                List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, userId);
                return ResponseEntity.ok(result);
            } else {
                // Mensagens normais cliente-admin
                String sql = "SELECT m.id, m.mensagem as message, " +
                           "m.remetente_id as sender_id, m.destinatario_id as receiver_id, " +
                           "m.iniciadoEm as created_at, m.lida as is_read " +
                           "FROM MensagensChat m " +
                           "WHERE (m.remetente_id = ? AND m.destinatario_id = 1) " +
                           "OR (m.remetente_id = 1 AND m.destinatario_id = ?) " +
                           "ORDER BY m.iniciadoEm ASC";
                           
                List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, userId, userId);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao buscar mensagens: " + e.getMessage());
        }
    }
    
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> dados) {
        try {
            String message = dados.get("message").toString();
            int senderId = Integer.parseInt(dados.get("sender_id").toString());
            int receiverId = Integer.parseInt(dados.get("receiver_id").toString());
            
            // Verificar se é barbeiro
            String checkBarberSql = "SELECT COUNT(*) FROM Barbeiro WHERE id = ?";
            int isBarber = jdbcTemplate.queryForObject(checkBarberSql, Integer.class, senderId);
            
            if (isBarber > 0) {
                // Mensagem de barbeiro - usar tabela MensagensBarbeiro
                String sql = "INSERT INTO MensagensBarbeiro (mensagem, barbeiro_id, admin_id, remetente_tipo) " +
                           "VALUES (?, ?, 1, 'barbeiro')";
                jdbcTemplate.update(sql, message, senderId);
            } else if (receiverId != 1) {
                // Admin respondendo para barbeiro
                String sql = "INSERT INTO MensagensBarbeiro (mensagem, barbeiro_id, admin_id, remetente_tipo) " +
                           "VALUES (?, ?, 1, 'admin')";
                jdbcTemplate.update(sql, message, receiverId);
            } else {
                // Mensagem normal cliente-admin
                String sql = "INSERT INTO MensagensChat (mensagem, lida, mensagemBot, iniciadoEm, remetente_id, destinatario_id) " +
                           "VALUES (?, 0, 0, CURRENT_TIMESTAMP, ?, ?)";
                jdbcTemplate.update(sql, message, senderId, receiverId);
            }
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Mensagem enviada"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/reset-chats")
    public ResponseEntity<?> resetChats() {
        try {
            // Deletar todas as mensagens do chat
            String sql = "DELETE FROM MensagensChat";
            jdbcTemplate.update(sql);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Todas as conversas foram resetadas com sucesso"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/clean-empty-chats")
    public ResponseEntity<?> cleanEmptyChats() {
        try {
            // Deletar conversas vazias (sem mensagens)
            String sql = "DELETE FROM MensagensChat WHERE id NOT IN (SELECT DISTINCT id FROM MensagensChat WHERE mensagem IS NOT NULL AND mensagem != '')";
            int rowsAffected = jdbcTemplate.update(sql);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Conversas vazias removidas com sucesso",
                "rowsAffected", rowsAffected
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}