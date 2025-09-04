package com.valyriancoders.Recall.Royale.service;

import com.valyriancoders.Recall.Royale.dto.*;
import com.valyriancoders.Recall.Royale.model.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameService {
    private Game game = new Game();
    private final Random rnd = new Random();

    // ======== lifecycle ========
    public Game getState() { return game; }

    public void createGame(CreateGameRequest req) {
        game = new Game();
        game.setMode(req.mode == null ? GameMode.LETTERS : req.mode);
        game.setBoardSize(req.rows, req.cols);
        game.getPlayers().clear();
        buildBoard(req.rows, req.cols, game.getMode());
        game.setStatus(GameStatus.LOBBY);
        game.setCurrentPlayerIdx(0);
        game.setFirstPickIndex(null);
        game.setPendingHide(null);
    }

    public Player join(String name) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name required");
        if (game.getStatus() != GameStatus.LOBBY) throw new IllegalStateException("game already started");
        String id = UUID.randomUUID().toString();
        Player p = new Player(id, name.trim());
        game.getPlayers().add(p);
        return p;
    }

    public void start() {
        if (game.getPlayers().size() < 2) throw new IllegalStateException("Need at least 2 players");
        game.setStatus(GameStatus.RUNNING);
        game.setCurrentPlayerIdx(0);
    }

    // ======== actions ========
    public FlipResponse flip(int index) {
        if (game.getStatus() != GameStatus.RUNNING) return new FlipResponse("IGNORED", null, game);

        // handle pending hide (client can call a /hide endpoint too, but auto-clean here if present)
        if (game.getPendingHide() != null) {
            hidePending();
        }

        Tile t = game.getTiles().get(index);
        if (t.isMatched() || t.isBlocked()) {
            if (t.isBlocked()) {
                // touching blocked tile: pass the turn
                advanceTurn();
                return new FlipResponse("BLOCKED", new int[]{index}, game);
            }
            return new FlipResponse("IGNORED", new int[]{index}, game);
        }

        Integer first = game.getFirstPickIndex();
        if (first == null) {
            // first pick
            t.setFaceUp(true);
            game.setFirstPickIndex(index);
            return new FlipResponse("FIRST", new int[]{index}, game);
        } else {
            // second pick
            Tile t1 = game.getTiles().get(first);
            t.setFaceUp(true);

            if (Objects.equals(t1.getKey(), t.getKey())) {
                // MATCH
                t1.setMatched(true); t.setMatched(true);
                t1.setFaceUp(true);  t.setFaceUp(true);
                game.getPlayers().get(game.getCurrentPlayerIdx()).addPoint();
                game.setFirstPickIndex(null);

                if (game.allMatched()) {
                    game.setStatus(GameStatus.FINISHED);
                }
                // same player continues
                return new FlipResponse("MATCH", new int[]{first, index}, game);
            } else {
                // MISMATCH: mark pending hide so UI can briefly show
                game.setPendingHide(new int[]{first, index});
                game.setFirstPickIndex(null);
                advanceTurn();
                return new FlipResponse("MISMATCH", new int[]{first, index}, game);
            }
        }
    }

    public Game hidePending() {
        if (game.getPendingHide() != null) {
            int a = game.getPendingHide()[0], b = game.getPendingHide()[1];
            game.getTiles().get(a).setFaceUp(false);
            game.getTiles().get(b).setFaceUp(false);
            game.setPendingHide(null);
        }
        return game;
    }

    // ======== helpers ========
    private void advanceTurn() {
        game.setCurrentPlayerIdx((game.getCurrentPlayerIdx() + 1) % game.getPlayers().size());
    }

    private void buildBoard(int rows, int cols, GameMode mode) {
        game.getTiles().clear();

        int total = rows * cols;
        boolean odd = (total % 2 == 1);
        int pairTiles = odd ? total - 1 : total; // leave one for BLOCK
        int pairs = pairTiles / 2;

        List<String> keys = new ArrayList<>();

        if (mode == GameMode.LETTERS) {
            // generate pairs with letters A..Z then AA.. etc if needed
            int need = pairs;
            int letter = 0;
            while (need-- > 0) {
                String k = letterKey(letter++);
                keys.add(k); keys.add(k);
            }
        } else {
            // IMAGES: fake ids car_01..; you can map to /static/images later
            for (int i = 1; i <= pairs; i++) {
                String k = String.format("img_%02d", i);
                keys.add(k); keys.add(k);
            }
        }


        Collections.shuffle(keys, rnd);

        // fill normal tiles
        for (int i = 0; i < pairTiles; i++) {
            game.getTiles().add(new Tile(i, keys.get(i), false));
        }

        // add BLOCK tile if odd (e.g., 9x9)
        if (odd) {
            Tile block = new Tile(pairTiles, "BLOCK", true);
            game.getTiles().add(block);
        }
    }

    private String letterKey(int n) {
        // A..Z, AA..ZZ, etc
        StringBuilder sb = new StringBuilder();
        n = n % 676; // keep it short for demo
        int first = n / 26;
        int second = n % 26;
        if (first > 0) sb.append((char)('A' + first - 1));
        sb.append((char)('A' + second));
        return sb.toString();
    }
}
