package com.valyriancoders.Recall.Royale.controller;

import com.valyriancoders.Recall.Royale.dto.*;
import com.valyriancoders.Recall.Royale.model.Game;
import com.valyriancoders.Recall.Royale.service.GameService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@CrossOrigin
public class GameController {


    private final GameService svc;
    public GameController(GameService svc) { this.svc = svc; }

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
    public Game state() { return svc.getState(); }

    @PostMapping("/flip")
    public FlipResponse flip(@RequestBody FlipRequest req) {
        return svc.flip(req.index);
    }

    @PostMapping("/hidePending")
    public Game hidePending() {
        return svc.hidePending();
    }
}
