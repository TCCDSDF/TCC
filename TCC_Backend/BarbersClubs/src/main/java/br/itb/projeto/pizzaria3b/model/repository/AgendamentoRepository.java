package br.itb.projeto.pizzaria3b.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import br.itb.projeto.pizzaria3b.model.entity.Agendamento;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    
    @Query(value = "SELECT a.id, a.dataAgendamento, a.statusAgendamento, " +
                   "c.nome as clienteNome, s.nome as servicoNome, a.barbeiro_id, a.usuario_id " +
                   "FROM Agendamento a " +
                   "JOIN Cliente c ON a.cliente_id = c.id " +
                   "JOIN Servico s ON a.servico_id = s.id " +
                   "WHERE a.barbeiro_id = :barbeiroId " +
                   "ORDER BY a.dataAgendamento DESC", nativeQuery = true)
    List<Object[]> findAgendamentosByBarbeiroId(@Param("barbeiroId") Long barbeiroId);
    
    @Query(value = "SELECT TOP 1 a.id, a.dataAgendamento, " +
                   "c.nome as clienteNome, s.nome as servicoNome, a.barbeiro_id, a.usuario_id " +
                   "FROM Agendamento a " +
                   "JOIN Cliente c ON a.cliente_id = c.id " +
                   "JOIN Servico s ON a.servico_id = s.id " +
                   "WHERE a.barbeiro_id = :barbeiroId " +
                   "AND a.statusAgendamento = 'Completo' " +
                   "ORDER BY a.dataAgendamento DESC", nativeQuery = true)
    Object[] findUltimoCorteByBarbeiroId(@Param("barbeiroId") Long barbeiroId);
    
    @Query(value = "SELECT TOP 1 a.id, a.dataAgendamento, " +
                   "c.nome as clienteNome, s.nome as servicoNome " +
                   "FROM Agendamento a " +
                   "JOIN Cliente c ON a.cliente_id = c.id " +
                   "JOIN Servico s ON a.servico_id = s.id " +
                   "WHERE a.barbeiro_id = :barbeiroId " +
                   "ORDER BY a.dataAgendamento DESC", nativeQuery = true)
    Object[] findUltimoAgendamentoByBarbeiroId(@Param("barbeiroId") Long barbeiroId);
    
    @Query(value = "SELECT a.id, a.dataAgendamento, a.statusAgendamento, " +
                   "c.nome as clienteNome, s.nome as servicoNome, a.barbeiro_id, a.usuario_id " +
                   "FROM Agendamento a " +
                   "JOIN Cliente c ON a.cliente_id = c.id " +
                   "JOIN Servico s ON a.servico_id = s.id " +
                   "WHERE a.barbeiro_id = :barbeiroId " +
                   "AND a.statusAgendamento = 'Pendente' " +
                   "ORDER BY a.dataAgendamento ASC", nativeQuery = true)
    List<Object[]> findAgendamentosPendentesByBarbeiroId(@Param("barbeiroId") Long barbeiroId);
    
    @Query(value = "SELECT a.id, a.dataAgendamento, a.statusAgendamento, " +
                   "c.nome as clienteNome, s.nome as servicoNome, a.barbeiro_id, a.usuario_id " +
                   "FROM Agendamento a " +
                   "JOIN Cliente c ON a.cliente_id = c.id " +
                   "JOIN Servico s ON a.servico_id = s.id " +
                   "WHERE a.barbeiro_id = :barbeiroId " +
                   "AND a.statusAgendamento = 'Confirmado' " +
                   "ORDER BY a.dataAgendamento ASC", nativeQuery = true)
    List<Object[]> findAgendamentosConfirmadosByBarbeiroId(@Param("barbeiroId") Long barbeiroId);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE Agendamento SET statusAgendamento = :status WHERE id = :agendamentoId", nativeQuery = true)
    void updateStatusAgendamento(@Param("agendamentoId") Long agendamentoId, @Param("status") String status);

    @Query(value = "SELECT a.id, a.dataAgendamento, a.statusAgendamento, " +
                   "c.nome as clienteNome, s.nome as servicoNome, b.nome as barbeiroNome, " +
                   "a.barbeiro_id, a.usuario_id " +
                   "FROM Agendamento a " +
                   "JOIN Cliente c ON a.cliente_id = c.id " +
                   "JOIN Servico s ON a.servico_id = s.id " +
                   "JOIN Barbeiro b ON a.barbeiro_id = b.id " +
                   "ORDER BY a.dataAgendamento DESC", nativeQuery = true)
    List<Object[]> findAllAgendamentosWithDetails();

    @Query(value = "SELECT a.id, a.dataAgendamento, a.statusAgendamento, " +
                   "c.nome as clienteNome, s.nome as servicoNome, b.nome as barbeiroNome, " +
                   "a.barbeiro_id, a.usuario_id " +
                   "FROM Agendamento a " +
                   "JOIN Cliente c ON a.cliente_id = c.id " +
                   "JOIN Servico s ON a.servico_id = s.id " +
                   "JOIN Barbeiro b ON a.barbeiro_id = b.id " +
                   "WHERE a.usuario_id = :usuarioId " +
                   "ORDER BY a.dataAgendamento DESC", nativeQuery = true)
    List<Object[]> findAgendamentosByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query(value = "SELECT COUNT(*) FROM Agendamento " +
                   "WHERE barbeiro_id = :barbeiroId " +
                   "AND dataAgendamento = :dataAgendamento " +
                   "AND statusAgendamento IN ('Pendente', 'Confirmado')", nativeQuery = true)
    int countAgendamentosByBarbeiroAndDateTime(@Param("barbeiroId") Integer barbeiroId, 
                                              @Param("dataAgendamento") String dataAgendamento);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO Agendamento (servico_id, barbeiro_id, dataAgendamento, statusAgendamento, cliente_id, usuario_id) " +
                   "VALUES (:servicoId, :barbeiroId, :dataAgendamento, 'Pendente', 1, :usuarioId)", nativeQuery = true)
    void criarAgendamento(@Param("servicoId") Integer servicoId, 
                         @Param("barbeiroId") Integer barbeiroId,
                         @Param("dataAgendamento") String dataAgendamento,
                         @Param("usuarioId") Integer usuarioId);
}