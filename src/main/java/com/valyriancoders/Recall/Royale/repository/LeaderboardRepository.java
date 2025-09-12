package com.valyriancoders.Recall.Royale.repository;

import com.valyriancoders.Recall.Royale.model.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {

    // Custom query to fetch top players sorted by score
    List<Leaderboard> findTop10ByOrderByScoreDesc();
}