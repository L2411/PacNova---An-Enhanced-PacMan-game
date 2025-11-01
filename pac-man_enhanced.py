import pygame, random, sys
from copy import deepcopy

# Initialize pygame
pygame.init()
pygame.display.set_caption("Pac-Man (Styled Edition)")

# Constants
WIDTH, HEIGHT = 560, 620
ROWS, COLS = 28, 28
TILE = WIDTH // COLS
GRID_TOP = 60
FPS = 12

# Colors
BG = (13, 38, 53)
HUD_BG = (9, 25, 35)
WALL_COLOR = (33, 76, 102)
DOT_COLOR = (255, 218, 121)
PELLET_COLOR = (255, 255, 255)
PACMAN_COLOR = (255, 234, 0)
GHOST_COLORS = [(255, 82, 82), (255, 138, 209), (71, 209, 255), (255, 193, 77)]
TEXT_COLOR = (255, 255, 255)
BTN_COLOR = (34, 94, 122)
BTN_HOVER = (55, 137, 189)

# Screen & font
# screen = pygame.display.set_mode((WIDTH, HEIGHT))
screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
font = pygame.font.SysFont("arial", 22)
font_bold = pygame.font.SysFont("arial", 26, bold=True)

# Layout
original_layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
]

layout = deepcopy(original_layout)

# Helpers
def idx_to_xy(i):
    x = (i % COLS) * TILE
    y = (i // COLS) * TILE + GRID_TOP
    return x, y

def draw_button(text, x, y, w, h, active=False):
    color = BTN_HOVER if active else BTN_COLOR
    pygame.draw.rect(screen, color, (x, y, w, h), border_radius=10)
    label = font.render(text, True, TEXT_COLOR)
    screen.blit(label, (x + (w - label.get_width()) // 2, y + (h - label.get_height()) // 2))

# Entities
pacman_index = 490
ghosts = []
score = 0
scared_timer = 0
paused = True
started = False
game_over = False

def init_ghosts():
    global ghosts
    ghosts = [
        {"index": 348, "color": GHOST_COLORS[0], "dir": random.choice([-1, 1, 28, -28]), "scared": False},
        {"index": 376, "color": GHOST_COLORS[1], "dir": random.choice([-1, 1, 28, -28]), "scared": False},
        {"index": 351, "color": GHOST_COLORS[2], "dir": random.choice([-1, 1, 28, -28]), "scared": False},
        {"index": 379, "color": GHOST_COLORS[3], "dir": random.choice([-1, 1, 28, -28]), "scared": False}
    ]

init_ghosts()

# Draw maze and HUD
def draw_board():
    screen.fill(BG)
    pygame.draw.rect(screen, HUD_BG, (0, 0, WIDTH, GRID_TOP))

    for i, val in enumerate(layout):
        x, y = idx_to_xy(i)
        if val == 1:
            pygame.draw.rect(screen, WALL_COLOR, (x+3, y+3, TILE-6, TILE-6), border_radius=6)
        elif val == 0:
            pygame.draw.circle(screen, DOT_COLOR, (x + TILE//2, y + TILE//2), 3)
        elif val == 3:
            pygame.draw.circle(screen, PELLET_COLOR, (x + TILE//2, y + TILE//2), 7)

    title = font_bold.render("PAC-MAN", True, TEXT_COLOR)
    score_text = font.render(f"Score: {score}", True, TEXT_COLOR)
    screen.blit(title, (WIDTH//2 - title.get_width()//2, 10))
    screen.blit(score_text, (30, 20))

    draw_button("Start", WIDTH - 220, 15, 70, 30, active=not started)
    draw_button("Pause", WIDTH - 140, 15, 70, 30, active=paused)
    draw_button("Restart", WIDTH - 60, 15, 70, 30)

def draw_pacman():
    x, y = idx_to_xy(pacman_index)
    pygame.draw.circle(screen, PACMAN_COLOR, (x + TILE//2, y + TILE//2), TILE//2 - 3)

def draw_ghosts():
    for g in ghosts:
        x, y = idx_to_xy(g["index"])
        color = (180, 200, 255) if g["scared"] else g["color"]
        pygame.draw.circle(screen, color, (x + TILE//2, y + TILE//2), TILE//2 - 3)

# Movement + collision
def move_pacman(keys):
    global pacman_index, score, scared_timer
    new_index = pacman_index
    if keys[pygame.K_LEFT] and pacman_index % COLS != 0 and layout[pacman_index-1] != 1:
        new_index -= 1
    elif keys[pygame.K_RIGHT] and pacman_index % COLS != COLS-1 and layout[pacman_index+1] != 1:
        new_index += 1
    elif keys[pygame.K_UP] and pacman_index - COLS >= 0 and layout[pacman_index-COLS] != 1:
        new_index -= COLS
    elif keys[pygame.K_DOWN] and pacman_index + COLS < len(layout) and layout[pacman_index+COLS] != 1:
        new_index += COLS

    if layout[new_index] == 0:
        layout[new_index] = 4
        score += 1
    elif layout[new_index] == 3:
        layout[new_index] = 4
        score += 10
        scared_timer = pygame.time.get_ticks() + 8000
        for g in ghosts:
            g["scared"] = True
    pacman_index = new_index

def move_ghosts():
    for g in ghosts:
        if random.randint(0, 10) < 2:
            g["dir"] = random.choice([-1, 1, 28, -28])
        target = g["index"] + g["dir"]
        if 0 <= target < len(layout) and layout[target] != 1:
            g["index"] = target
        else:
            g["dir"] = random.choice([-1, 1, 28, -28])

def check_collisions():
    global score, game_over
    for g in ghosts:
        if g["index"] == pacman_index:
            if g["scared"]:
                score += 100
                g["index"] = random.choice([348, 376, 351, 379])
                g["scared"] = False
            else:
                game_over = True

def check_win():
    if all(v != 0 and v != 3 for v in layout):
        return True
    return False

# Restart
def reset_game():
    global layout, pacman_index, score, scared_timer, paused, started, game_over
    layout = deepcopy(original_layout)
    pacman_index = 490
    score = 0
    scared_timer = 0
    paused = True
    started = False
    game_over = False
    init_ghosts()

# Main loop
clock = pygame.time.Clock()
running = True

while running:
    clock.tick(FPS)
    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            running = False
        elif e.type == pygame.MOUSEBUTTONDOWN:
            mx, my = e.pos
            if 340 <= mx <= 410 and 15 <= my <= 45:
                started = True
                paused = False
            elif 420 <= mx <= 490 and 15 <= my <= 45:
                if started:
                    paused = not paused
            elif 500 <= mx <= 570 and 15 <= my <= 45:
                reset_game()

    if started and not paused and not game_over:
        keys = pygame.key.get_pressed()
        move_pacman(keys)
        move_ghosts()
        check_collisions()

        if scared_timer and pygame.time.get_ticks() > scared_timer:
            for g in ghosts:
                g["scared"] = False
            scared_timer = 0

    draw_board()
    draw_pacman()
    draw_ghosts()

    if game_over:
        text = font_bold.render("Game Over! Click Restart", True, TEXT_COLOR)
        screen.blit(text, (WIDTH//2 - text.get_width()//2, HEIGHT//2))
    elif not started:
        text = font_bold.render("Click Start to Play", True, TEXT_COLOR)
        screen.blit(text, (WIDTH//2 - text.get_width()//2, HEIGHT//2))

    elif check_win():
        text = font_bold.render("You Win! 🎉", True, TEXT_COLOR)
        screen.blit(text, (WIDTH//2 - text.get_width()//2, HEIGHT//2))
        paused = True

    pygame.display.flip()

pygame.quit()
