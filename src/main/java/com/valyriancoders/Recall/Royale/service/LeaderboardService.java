package com.valyriancoders.Recall.Royale.service;

import com.valyriancoders.Recall.Royale.model.Leaderboard;
import com.valyriancoders.Recall.Royale.repository.LeaderboardRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;

    public LeaderboardService(LeaderboardRepository leaderboardRepository) {
        this.leaderboardRepository = leaderboardRepository;
    }

    public Leaderboard saveWinner(String playerName, int score) {
        Leaderboard lb = new Leaderboard();
        lb.setPlayerName(playerName);
        lb.setScore(score);
        return leaderboardRepository.save(lb);
    }

    public List<Leaderboard> getTopPlayers() {
        return leaderboardRepository.findTop10ByOrderByScoreDesc();
    }
}
