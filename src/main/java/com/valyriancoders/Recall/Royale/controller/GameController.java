package com.valyriancoders.Recall.Royale.controller;

import com.valyriancoders.Recall.Royale.dto.*;
import com.valyriancoders.Recall.Royale.model.Game;
import com.valyriancoders.Recall.Royale.model.Leaderboard;
import com.valyriancoders.Recall.Royale.service.GameService;
import com.valyriancoders.Recall.Royale.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game")
@CrossOrigin
public class GameController {

    private final GameService svc;

    @Autowired
    private LeaderboardService leaderboardService;

    public GameController(GameService svc) {
        this.svc = svc;
    }

    @PostMapping("/create")
    public Game create(@RequestBody CreateGameRequest req) {
        svc.createGame(req);
        return svc.getState();
    }

    @PostMapping("/join")
    public Game join(@RequestBody JoinRequest req) {
        svc.join(req.name);
        return svc.getState();
    }

    @PostMapping("/start")
    public Game start() {
        svc.start();
        return svc.getState();
    }

    @GetMapping("/state")
    public Game state() {
        return svc.getState();
    }

    @PostMapping("/flip")
    public FlipResponse flip(@RequestBody FlipRequest req) {
        return svc.flip(req.index);
    }

    @PostMapping("/hidePending")
    public Game hidePending() {
        return svc.hidePending();
    }

    // ✅ Save winner to leaderboard
    @PostMapping("/winner")
    public ResponseEntity<String> saveWinner(
            @RequestParam String playerName,
            @RequestParam int score) {
        leaderboardService.saveWinner(playerName, score);
        return ResponseEntity.ok("Winner saved to leaderboard!");
    }

    // ✅ Get leaderboard (top 10 players by score)
    @GetMapping("/leaderboard")
    public ResponseEntity<List<Leaderboard>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getTopPlayers());
    }
}
