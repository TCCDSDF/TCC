package br.itb.projeto.pizzaria3b.rest.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.pizzaria3b.model.repository.AgendamentoRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;
    
    private static List<Map<String, Object>> agendamentosMemoria = new ArrayList<>();
    private static Long nextId = 1L;

    @GetMapping
    public ResponseEntity<?> getAllAgendamentos() {
        try {
            List<Object[]> resultados = agendamentoRepository.findAllAgendamentosWithDetails();
            List<Map<String, Object>> agendamentos = resultados.stream()
                .map(row -> {
                    Map<String, Object> agendamento = new HashMap<>();
                    agendamento.put("id", row[0]);
                    agendamento.put("dataAgendamento", row[1]);
                    agendamento.put("statusAgendamento", row[2]);
                    agendamento.put("clienteNome", row[3]);
                    agendamento.put("servicoNome", row[4]);
                    agendamento.put("barbeiroNome", row[5]);
                    agendamento.put("barbeiro_id", row[6]);
                    agendamento.put("usuario_id", row[7]);
                    return agendamento;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(agendamentos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar agendamentos: " + e.getMessage());
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> getAgendamentosByUsuario(@PathVariable Long usuarioId) {
        try {
            List<Object[]> resultados = agendamentoRepository.findAgendamentosByUsuarioId(usuarioId);
            List<Map<String, Object>> agendamentos = resultados.stream()
                .map(row -> {
                    Map<String, Object> agendamento = new HashMap<>();
                    agendamento.put("id", row[0]);
                    agendamento.put("dataAgendamento", row[1]);
                    agendamento.put("statusAgendamento", row[2]);
                    agendamento.put("clienteNome", row[3]);
                    agendamento.put("servicoNome", row[4]);
                    agendamento.put("barbeiroNome", row[5]);
                    agendamento.put("barbeiro_id", row[6]);
                    agendamento.put("usuario_id", row[7]);
                    return agendamento;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(agendamentos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar agendamentos: " + e.getMessage());
        }
    }

    @GetMapping("/barbeiro/{barbeiroId}")
    public ResponseEntity<?> getAgendamentosByBarbeiro(@PathVariable Long barbeiroId) {
        try {
            List<Object[]> resultados = agendamentoRepository.findAgendamentosByBarbeiroId(barbeiroId);
            List<Map<String, Object>> agendamentos = resultados.stream()
                .map(row -> Map.of(
                    "id", row[0],
                    "dataAgendamento", row[1],
                    "statusAgendamento", row[2],
                    "clienteNome", row[3],
                    "servicoNome", row[4],
                    "barbeiro_id", row[5],
                    "usuario_id", row[6]
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(agendamentos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar agendamentos: " + e.getMessage());
        }
    }

    @GetMapping("/ultimo-corte/{barbeiroId}")
    public ResponseEntity<?> getUltimoCorte(@PathVariable Long barbeiroId) {
        try {
            Object[] ultimoCorte = agendamentoRepository.findUltimoCorteByBarbeiroId(barbeiroId);
            if (ultimoCorte != null) {
                Map<String, Object> resultado = Map.of(
                    "id", ultimoCorte[0],
                    "dataAgendamento", ultimoCorte[1],
                    "clienteNome", ultimoCorte[2],
                    "servicoNome", ultimoCorte[3],
                    "barbeiro_id", ultimoCorte[4],
                    "usuario_id", ultimoCorte[5]
                );
                return ResponseEntity.ok(resultado);
            } else {
                Object[] ultimoAgendamento = agendamentoRepository.findUltimoAgendamentoByBarbeiroId(barbeiroId);
                if (ultimoAgendamento != null) {
                    Map<String, Object> resultado = Map.of(
                        "id", ultimoAgendamento[0],
                        "dataAgendamento", ultimoAgendamento[1],
                        "clienteNome", ultimoAgendamento[2],
                        "servicoNome", ultimoAgendamento[3],
                        "barbeiro_id", ultimoAgendamento[4],
                        "usuario_id", ultimoAgendamento[5]
                    );
                    return ResponseEntity.ok(resultado);
                }
                return ResponseEntity.ok(null);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar último corte: " + e.getMessage());
        }
    }

    @GetMapping("/pendentes/{barbeiroId}")
    public ResponseEntity<?> getAgendamentosPendentes(@PathVariable Long barbeiroId) {
        try {
            List<Object[]> resultados = agendamentoRepository.findAgendamentosPendentesByBarbeiroId(barbeiroId);
            List<Map<String, Object>> agendamentos = resultados.stream()
                .map(row -> Map.of(
                    "id", row[0],
                    "dataAgendamento", row[1],
                    "statusAgendamento", row[2],
                    "clienteNome", row[3],
                    "servicoNome", row[4],
                    "barbeiro_id", row[5],
                    "usuario_id", row[6]
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(agendamentos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar agendamentos pendentes: " + e.getMessage());
        }
    }

    @GetMapping("/confirmados/{barbeiroId}")
    public ResponseEntity<?> getAgendamentosConfirmados(@PathVariable Long barbeiroId) {
        try {
            List<Object[]> resultados = agendamentoRepository.findAgendamentosConfirmadosByBarbeiroId(barbeiroId);
            List<Map<String, Object>> agendamentos = resultados.stream()
                .map(row -> Map.of(
                    "id", row[0],
                    "dataAgendamento", row[1],
                    "statusAgendamento", row[2],
                    "clienteNome", row[3],
                    "servicoNome", row[4],
                    "barbeiro_id", row[5],
                    "usuario_id", row[6]
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(agendamentos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar agendamentos confirmados: " + e.getMessage());
        }
    }

    @PutMapping("/confirmar/{agendamentoId}")
    public ResponseEntity<?> confirmarAgendamento(@PathVariable Long agendamentoId) {
        try {
            agendamentoRepository.updateStatusAgendamento(agendamentoId, "Completo");
            return ResponseEntity.ok(Map.of(
                "message", "Agendamento concluído com sucesso",
                "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Erro ao confirmar agendamento: " + e.getMessage(),
                "success", false
            ));
        }
    }

    @PutMapping("/rejeitar/{agendamentoId}")
    public ResponseEntity<?> rejeitarAgendamento(@PathVariable Long agendamentoId) {
        try {
            agendamentoRepository.updateStatusAgendamento(agendamentoId, "Cancelado");
            return ResponseEntity.ok(Map.of(
                "message", "Agendamento rejeitado com sucesso",
                "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Erro ao rejeitar agendamento: " + e.getMessage(),
                "success", false
            ));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelarAgendamento(@PathVariable Long id) {
        try {
            System.out.println("DELETE endpoint chamado para ID: " + id);
            agendamentoRepository.updateStatusAgendamento(id, "Cancelado");
            return ResponseEntity.ok(Map.of(
                "message", "Agendamento cancelado com sucesso",
                "success", true
            ));
        } catch (Exception e) {
            System.out.println("Erro ao cancelar: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Erro ao cancelar agendamento: " + e.getMessage(),
                "success", false
            ));
        }
    }

    @PostMapping
    public ResponseEntity<?> criarAgendamento(@RequestBody Map<String, Object> agendamento) {
        try {
            String dataOriginal = (String) agendamento.get("dataAgendamento");
            String dataSemTimezone = dataOriginal.substring(0, 19);
            Integer barbeiroId = (Integer) agendamento.get("barbeiro_id");
            
            // Verificar se já existe agendamento no mesmo horário
            int existingCount = agendamentoRepository.countAgendamentosByBarbeiroAndDateTime(
                barbeiroId, dataSemTimezone
            );
            
            if (existingCount > 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Este horário já está ocupado",
                    "success", false
                ));
            }
            
            agendamentoRepository.criarAgendamento(
                (Integer) agendamento.get("servico_id"),
                barbeiroId,
                dataSemTimezone,
                (Integer) agendamento.get("usuario_id")
            );
            return ResponseEntity.ok(Map.of(
                "message", "Agendamento criado com sucesso",
                "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Erro ao criar agendamento: " + e.getMessage(),
                "success", false
            ));
        }
    }
    

    

}