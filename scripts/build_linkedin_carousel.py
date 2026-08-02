from pathlib import Path
from shutil import copyfile

from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "twelvecheck-linkedin-carousel.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "twelvecheck-launch-checklist-carousel.pdf"

PAGE_W = 720
PAGE_H = 900
MARGIN = 54

INK = HexColor("#111111")
ORANGE = HexColor("#ff3d0a")
WASH = HexColor("#fff0e8")
GRAY = HexColor("#686868")
LIGHT = HexColor("#e4e4e4")
WHITE = HexColor("#ffffff")

FONT_REGULAR = "Arial"
FONT_BOLD = "Arial-Bold"
FONT_DISPLAY = "ArialNarrow-Bold"


def register_fonts():
    fonts = Path("C:/Windows/Fonts")
    pdfmetrics.registerFont(TTFont(FONT_REGULAR, str(fonts / "arial.ttf")))
    pdfmetrics.registerFont(TTFont(FONT_BOLD, str(fonts / "arialbd.ttf")))
    pdfmetrics.registerFont(TTFont(FONT_DISPLAY, str(fonts / "ARIALNB.TTF")))


def lines_for(text, font, size, width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if pdfmetrics.stringWidth(candidate, font, size) <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_lines(c, text, x, y, width, font=FONT_REGULAR, size=13, leading=None, color=INK, max_lines=None):
    leading = leading or size * 1.3
    lines = lines_for(text, font, size, width)
    if max_lines:
        lines = lines[:max_lines]
    c.setFillColor(color)
    c.setFont(font, size)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_label(c, text, x, y, fill=ORANGE, text_color=WHITE):
    size = 10
    pad_x = 10
    width = pdfmetrics.stringWidth(text.upper(), FONT_BOLD, size) + pad_x * 2
    c.setFillColor(fill)
    c.rect(x, y - 18, width, 24, stroke=0, fill=1)
    c.setFillColor(text_color)
    c.setFont(FONT_BOLD, size)
    c.drawString(x + pad_x, y - 11, text.upper())
    return width


def draw_header(c, page_num, section):
    c.setStrokeColor(INK)
    c.setLineWidth(2)
    c.line(MARGIN, PAGE_H - 38, PAGE_W - MARGIN, PAGE_H - 38)
    c.setFont(FONT_DISPLAY, 18)
    c.setFillColor(INK)
    c.drawString(MARGIN, PAGE_H - 27, "TwelveCheck")
    c.setFont(FONT_BOLD, 9)
    c.setFillColor(GRAY)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 27, f"{section.upper()}   {page_num:02d}/08")


def draw_footer(c, page_num, action="Save this for launch day"):
    c.setStrokeColor(INK)
    c.setLineWidth(1)
    c.line(MARGIN, 42, PAGE_W - MARGIN, 42)
    c.setFillColor(GRAY)
    c.setFont(FONT_REGULAR, 9)
    c.drawString(MARGIN, 27, action)
    c.drawRightString(PAGE_W - MARGIN, 27, f"twelvecheck.com-style field guide | {page_num:02d}")


def draw_title(c, title, subtitle=None, tag=None):
    y = PAGE_H - 92
    if tag:
        draw_label(c, tag, MARGIN, y)
        y -= 48
    title_lines = lines_for(title, FONT_DISPLAY, 46, PAGE_W - 2 * MARGIN)
    c.setFillColor(INK)
    c.setFont(FONT_DISPLAY, 46)
    for line in title_lines:
        c.drawString(MARGIN, y, line)
        y -= 45
    if subtitle:
        y -= 10
        y = draw_lines(c, subtitle, MARGIN, y, PAGE_W - 2 * MARGIN, size=14, leading=19, color=GRAY)
    return y


def draw_check_card(c, x, y_top, width, number, title, instruction, failure):
    height = 235
    y_bottom = y_top - height
    c.setFillColor(WHITE)
    c.setStrokeColor(INK)
    c.setLineWidth(1.5)
    c.rect(x, y_bottom, width, height, stroke=1, fill=1)

    c.setFillColor(ORANGE)
    c.rect(x, y_top - 48, 48, 48, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(FONT_DISPLAY, 25)
    c.drawCentredString(x + 24, y_top - 35, f"{number:02d}")

    title_x = x + 62
    title_y = y_top - 22
    title_lines = lines_for(title, FONT_DISPLAY, 19, width - 76)
    c.setFillColor(INK)
    c.setFont(FONT_DISPLAY, 19)
    for line in title_lines[:2]:
        c.drawString(title_x, title_y, line)
        title_y -= 20

    body_y = y_top - 82
    body_y = draw_lines(c, instruction, x + 18, body_y, width - 36, size=11.5, leading=15.5, color=INK, max_lines=4)
    body_y -= 7
    c.setStrokeColor(LIGHT)
    c.line(x + 18, body_y, x + width - 18, body_y)
    body_y -= 20
    c.setFont(FONT_BOLD, 10)
    c.setFillColor(ORANGE)
    c.drawString(x + 18, body_y, "FAILURE SIGNAL")
    body_y -= 16
    draw_lines(c, failure, x + 18, body_y, width - 36, size=10, leading=13.5, color=GRAY, max_lines=3)


def page_cover(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(ORANGE)
    c.rect(0, PAGE_H - 18, PAGE_W, 18, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont(FONT_DISPLAY, 24)
    c.drawString(MARGIN, PAGE_H - 66, "TwelveCheck")
    c.setFont(FONT_BOLD, 10)
    c.setFillColor(GRAY)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 62, "FIELD GUIDE 01")

    c.setFillColor(WASH)
    c.rect(MARGIN, 138, PAGE_W - 2 * MARGIN, 630, stroke=0, fill=1)
    c.setFillColor(ORANGE)
    c.setFont(FONT_DISPLAY, 224)
    c.drawString(MARGIN + 12, 528, "12")
    c.setFillColor(INK)
    c.setFont(FONT_DISPLAY, 56)
    c.drawString(MARGIN + 22, 448, "launch checks")
    c.drawString(MARGIN + 22, 394, "before you announce.")
    draw_lines(
        c,
        "A normal-user pass for SaaS founders: first contact, core journey, and launch truth.",
        MARGIN + 24,
        338,
        PAGE_W - 2 * MARGIN - 48,
        size=16,
        leading=23,
        color=INK,
    )

    labels = [("FIRST CONTACT", 24), ("CORE JOURNEY", 186), ("LAUNCH TRUTH", 344)]
    for text, dx in labels:
        draw_label(c, text, MARGIN + 24 + dx, 236, fill=INK)

    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 12)
    c.drawString(MARGIN + 24, 176, "Built for public paths. No credentials. No security claims.")

    c.setStrokeColor(INK)
    c.setLineWidth(2)
    c.line(MARGIN, 92, PAGE_W - MARGIN, 92)
    c.setFont(FONT_BOLD, 12)
    c.setFillColor(ORANGE)
    c.drawString(MARGIN, 66, "SWIPE")
    c.setFillColor(INK)
    c.drawRightString(PAGE_W - MARGIN, 66, "Save it before launch day")
    c.showPage()


def page_checks(c, page_num, section, title, subtitle, checks):
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_header(c, page_num, section)
    y = draw_title(c, title, subtitle, section)
    y_top = min(y - 22, 660)
    width = 294
    gap = 24
    x1 = MARGIN
    x2 = MARGIN + width + gap
    positions = [(x1, y_top), (x2, y_top), (x1, y_top - 255), (x2, y_top - 255)]
    for pos, data in zip(positions, checks):
        draw_check_card(c, pos[0], pos[1], width, *data)
    draw_footer(c, page_num)
    c.showPage()


def page_method(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_header(c, 5, "method")
    draw_title(c, "Run it like a buyer, not the builder.", "Four constraints make the checklist useful instead of theatrical.", "method")

    steps = [
        ("01", "Go private", "Open a private browser window. Start from the public URL, not an internal shortcut."),
        ("02", "Use two widths", "Test desktop and a common phone width. A 390-pixel viewport catches avoidable mobile blockers."),
        ("03", "Use safe data", "Take only ordinary public actions. Never share credentials, private URLs, secrets, or customer data."),
        ("04", "Record the result", "Keep the URL, UTC time, viewport, step number, expected result, observed result, and screenshot."),
    ]

    y = 623
    for number, title, body in steps:
        c.setFillColor(WASH if number in ("01", "03") else WHITE)
        c.setStrokeColor(INK)
        c.setLineWidth(1.5)
        c.rect(MARGIN, y - 116, PAGE_W - 2 * MARGIN, 104, stroke=1, fill=1)
        c.setFillColor(ORANGE)
        c.setFont(FONT_DISPLAY, 42)
        c.drawString(MARGIN + 18, y - 70, number)
        c.setFillColor(INK)
        c.setFont(FONT_DISPLAY, 23)
        c.drawString(MARGIN + 112, y - 45, title)
        draw_lines(c, body, MARGIN + 112, y - 70, PAGE_W - 2 * MARGIN - 138, size=11.5, leading=16, color=GRAY, max_lines=3)
        y -= 122

    c.setFillColor(INK)
    c.rect(MARGIN, 78, PAGE_W - 2 * MARGIN, 62, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 13)
    c.drawString(MARGIN + 18, 111, "Rule of thumb")
    c.setFont(FONT_REGULAR, 11)
    c.drawString(MARGIN + 146, 111, "If another person cannot reproduce it, it is not ready for the issue list.")
    draw_footer(c, 5)
    c.showPage()


def page_evidence(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_header(c, 6, "evidence")
    draw_title(c, "A finding without evidence is an opinion.", "Capture enough context for the builder to reproduce the moment.", "evidence")

    card_x = MARGIN
    card_y = 236
    card_w = PAGE_W - 2 * MARGIN
    card_h = 410
    c.setStrokeColor(INK)
    c.setLineWidth(2)
    c.rect(card_x, card_y, card_w, card_h, stroke=1, fill=0)
    c.setFillColor(INK)
    c.rect(card_x, card_y + card_h - 52, card_w, 52, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(card_x + 18, card_y + card_h - 32, "ISSUE 03   /   PUBLIC PRICING JOURNEY")
    c.setFillColor(ORANGE)
    c.rect(card_x + card_w - 70, card_y + card_h - 42, 48, 30, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(FONT_DISPLAY, 18)
    c.drawCentredString(card_x + card_w - 46, card_y + card_h - 33, "P1")

    c.setFillColor(INK)
    c.setFont(FONT_DISPLAY, 28)
    c.drawString(card_x + 22, card_y + card_h - 96, "Checkout price contradicts the pricing page")

    fields = [
        ("PUBLIC URL", "example.com/pricing"),
        ("UTC TIME", "2026-08-02 10:24 UTC"),
        ("VIEWPORT", "390 x 844 pixels"),
        ("STEP", "Pricing page -> monthly plan -> checkout"),
        ("EXPECTED", "$29 per month, billed monthly"),
        ("OBSERVED", "$39 charge at checkout with no explanation"),
    ]
    y = card_y + card_h - 140
    for label, value in fields:
        c.setStrokeColor(LIGHT)
        c.line(card_x + 22, y - 14, card_x + card_w - 22, y - 14)
        c.setFillColor(ORANGE)
        c.setFont(FONT_BOLD, 9)
        c.drawString(card_x + 22, y, label)
        c.setFillColor(INK)
        c.setFont(FONT_REGULAR, 11)
        c.drawString(card_x + 132, y, value)
        y -= 43

    c.setFillColor(WASH)
    c.rect(MARGIN, 116, card_w, 84, stroke=0, fill=1)
    c.setFillColor(ORANGE)
    c.setFont(FONT_DISPLAY, 23)
    c.drawString(MARGIN + 20, 163, "+ one screenshot")
    draw_lines(c, "Show the visible state, not a cropped fragment with no location or context.", MARGIN + 20, 139, card_w - 40, size=11, leading=15, color=INK)
    draw_footer(c, 6)
    c.showPage()


def page_priority(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    draw_header(c, 7, "priority")
    draw_title(c, "Fix blockers before polishing friction.", "Three labels are enough when they describe impact, not drama.", "priority")

    bands = [
        (ORANGE, WHITE, "P0", "Launch journey blocked", "A visitor cannot complete the promised public journey.", "Examples: dead signup, checkout cannot complete, primary action fails."),
        (INK, WHITE, "P1", "Material conversion friction", "The journey works, but trust, clarity, or progress is materially damaged.", "Examples: price mismatch, silent validation, missing confirmation."),
        (WASH, INK, "P2", "Clarity or polish", "The visitor can proceed; the issue still creates avoidable hesitation or effort.", "Examples: weak empty state, unclear label, non-critical layout defect."),
    ]
    y = 632
    for fill, text_color, code, title, definition, examples in bands:
        h = 152
        c.setFillColor(fill)
        c.rect(MARGIN, y - h, PAGE_W - 2 * MARGIN, h, stroke=0, fill=1)
        c.setFillColor(text_color)
        c.setFont(FONT_DISPLAY, 48)
        c.drawString(MARGIN + 20, y - 59, code)
        c.setFont(FONT_DISPLAY, 25)
        c.drawString(MARGIN + 126, y - 42, title)
        draw_lines(c, definition, MARGIN + 126, y - 70, PAGE_W - 2 * MARGIN - 150, size=11, leading=15, color=text_color, max_lines=2)
        draw_lines(c, examples, MARGIN + 126, y - 112, PAGE_W - 2 * MARGIN - 150, font=FONT_BOLD, size=10, leading=14, color=text_color, max_lines=2)
        y -= h + 18

    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 12)
    c.drawString(MARGIN, 105, "Severity is a decision aid. It is not a substitute for the evidence on page 6.")
    draw_footer(c, 7)
    c.showPage()


def page_cta(c):
    c.setFillColor(INK)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(ORANGE)
    c.rect(0, PAGE_H - 18, PAGE_W, 18, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(FONT_DISPLAY, 22)
    c.drawString(MARGIN, PAGE_H - 62, "TwelveCheck")
    c.setFont(FONT_BOLD, 10)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 59, "08/08")

    draw_label(c, "YOUR NEXT MOVE", MARGIN, PAGE_H - 116, fill=ORANGE)
    c.setFillColor(WHITE)
    c.setFont(FONT_DISPLAY, 50)
    c.drawString(MARGIN, 716, "Run it yourself.")
    c.drawString(MARGIN, 668, "Or reserve a second pair of eyes.")
    draw_lines(c, "The free checklist is public. The paid reviews add timestamped evidence, a prioritized issue list, and a short walkthrough.", MARGIN, 623, PAGE_W - 2 * MARGIN, size=14, leading=20, color=HexColor("#d7d7d7"))

    offer_y = 496
    offers = [
        ("MINI", "$39 total", "$19.50 deposit today", "1 public journey | 4 checks | initial delivery within 4 hours"),
        ("FULL", "$89 total", "$44.50 deposit today", "3 public journeys | 12 checks | initial delivery within 12 hours"),
    ]
    for label, price, deposit, scope in offers:
        c.setStrokeColor(WHITE)
        c.setLineWidth(1.5)
        c.rect(MARGIN, offer_y - 122, PAGE_W - 2 * MARGIN, 108, stroke=1, fill=0)
        c.setFillColor(ORANGE)
        c.setFont(FONT_DISPLAY, 18)
        c.drawString(MARGIN + 18, offer_y - 47, label)
        c.setFillColor(WHITE)
        c.setFont(FONT_DISPLAY, 32)
        c.drawString(MARGIN + 104, offer_y - 49, price)
        c.setFont(FONT_BOLD, 11)
        c.drawString(MARGIN + 324, offer_y - 43, deposit)
        draw_lines(c, scope, MARGIN + 104, offer_y - 78, PAGE_W - 2 * MARGIN - 130, size=10.5, leading=14, color=HexColor("#d7d7d7"), max_lines=2)
        offer_y -= 132

    c.setFillColor(ORANGE)
    c.rect(MARGIN, 151, PAGE_W - 2 * MARGIN, 76, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(FONT_DISPLAY, 23)
    c.drawString(MARGIN + 20, 191, "Free checklist + live offer")
    c.setFont(FONT_BOLD, 12)
    url = "mshafei721.github.io/twelvecheck/"
    c.drawString(MARGIN + 20, 169, url)
    c.linkURL(f"https://{url}", (MARGIN, 151, PAGE_W - MARGIN, 227), relative=0)

    c.setFillColor(HexColor("#bdbdbd"))
    c.setFont(FONT_REGULAR, 9)
    c.drawString(MARGIN, 102, "Public, credential-free checks only. No security, compliance, load, or private-system assurance.")
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 11)
    c.drawString(MARGIN, 64, "Save the guide. Share it with a founder who is close to launch.")
    c.showPage()


def build():
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=(PAGE_W, PAGE_H), pageCompression=1)
    c.setTitle("12 SaaS launch checks before you announce")
    c.setAuthor("TwelveCheck")
    c.setSubject("A normal-user launch checklist for SaaS founders")
    c.setKeywords("SaaS launch checklist, software testing, UX review, launch QA")

    page_cover(c)
    page_checks(
        c,
        2,
        "first contact",
        "Start like a stranger.",
        "The first screen should explain the product and offer one honest next step.",
        [
            (1, "Value is obvious in five seconds", "Load the homepage cold. Can someone state who it is for, what it does, and why it matters without scrolling?", "The description fits several unrelated products."),
            (2, "Headline matches the product", "Compare the headline with the current product screen, release, or documented workflow.", "Launch copy describes an older product or an unavailable feature."),
            (3, "Primary action is unambiguous", "Follow the dominant first-screen button. Its label should predict the destination and next step.", "Get started opens a demo, waitlist, generic page, or dead anchor."),
            (4, "Mobile first screen holds", "Test a 390-pixel viewport. Check headline, main action, navigation, consent layers, and overflow.", "The action is clipped, covered, or pushed below avoidable chrome."),
        ],
    )
    page_checks(
        c,
        3,
        "core journey",
        "Can a new visitor reach value?",
        "A dashboard is not the outcome. Complete the first meaningful public journey.",
        [
            (5, "Sign up or log in works", "Use the public entry point. Note redirects, validation, loading states, and confirmation.", "A successful action returns to the same state with no explanation."),
            (6, "First key action succeeds", "Complete the one safe action that demonstrates the product's promised value.", "The visitor arrives but cannot find or finish the first meaningful task."),
            (7, "Recovery path is clear", "Trigger one ordinary validation error or empty result. The message should explain the next step.", "A generic error, silent reset, or disabled action strands the visitor."),
            (8, "Empty states guide forward", "Inspect new-account, no-result, and zero-item states that appear naturally.", "The page names what is missing but offers no action or example."),
        ],
    )
    page_checks(
        c,
        4,
        "launch truth",
        "Does the public promise match?",
        "Price, scope, status, and accessibility should agree across the surfaces a buyer sees.",
        [
            (9, "Pricing path is consistent", "Compare homepage, pricing, checkout, FAQ, and terms for price, billing, limits, trial, and cancellation.", "A buyer cannot tell which public promise governs the purchase."),
            (10, "Launch promise matches the build", "Check the launch post or listing against the current homepage and reachable product paths.", "Names, scope, integrations, or availability drift between surfaces."),
            (11, "Confirmations explain next steps", "After signup, purchase, or submission, look for status, ownership, timing, and the next action.", "Success looks identical to failure or creates unexplained waiting."),
            (12, "Obvious accessibility blockers are absent", "Keyboard through the journey, zoom to 200%, inspect labels, and check meaningful image alternatives.", "Focus disappears, controls have no name, or content becomes unreachable."),
        ],
    )
    page_method(c)
    page_evidence(c)
    page_priority(c)
    page_cta(c)
    c.save()
    copyfile(OUTPUT, PUBLIC_OUTPUT)
    print(OUTPUT)
    print(PUBLIC_OUTPUT)


if __name__ == "__main__":
    build()
