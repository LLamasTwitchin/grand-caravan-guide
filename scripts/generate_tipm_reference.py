"""Build a source-based TIPM fuse reference PDF for the 2012 Grand Caravan.

Requires ReportLab. The cavity assignments are transcribed from the supplied
2012 Owner's Manual; the #1-58 column cross-references the supplied fuse-list
screenshots. The PDF deliberately avoids inventing a spatial fuse layout.
"""

from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "docs" / "2012-dodge-grand-caravan-tipm-reference.pdf"
OWNER_GUIDE = (
    "https://vehicleinfo.mopar.com/assets/publications/en-us/"
    "Dodge/2012/Grand_Caravan/328.pdf"
)
STARTMYCAR = "https://www.startmycar.com/dodge/grand-caravan/info/fusebox/2012"

INK = colors.HexColor("#182124")
PANEL = colors.HexColor("#f0ede5")
MUTED = colors.HexColor("#596567")
ORANGE = colors.HexColor("#c9652e")
PALE_ORANGE = colors.HexColor("#fff2e8")
LINE = colors.HexColor("#d0cbc0")
ROW = colors.HexColor("#f5f3ed")
WHITE = colors.white
MARGIN = 0.55 * inch
CONTENT_WIDTH = letter[0] - 2 * MARGIN


# Screenshot-list sequence #1-58 -> OEM cavity code.
INDEX_BY_CAVITY = {
    "J1": "15", "J2": "13", "J3": "17", "J4": "19", "J5": "20",
    "J6": "11", "J7": "6", "J8": "18", "J9": "3", "J10": "10",
    "J11": "9", "J12": "-", "J13": "7", "J14": "12", "J15": "16",
    "J17": "2", "J18": "1", "J19": "14", "J20": "5", "J21": "4",
    "J22": "8",
    "M1": "49", "M2": "50", "M3": "21", "M4": "51", "M5": "58",
    "M6": "57", "M7": "52", "M8": "46", "M9": "48", "M10": "37",
    "M11": "39", "M12": "38", "M13": "42", "M14": "47", "M15": "22",
    "M16": "44", "M17": "33", "M18": "31", "M19": "25", "M20": "53",
    "M21": "26", "M22": "28", "M23": "32", "M24": "40", "M25": "41",
    "M26": "30", "M27": "54", "M28": "29", "M29": "56", "M30": "35",
    "M31": "27", "M32": "43*", "M33": "23", "M34": "45", "M35": "34",
    "M36": "55", "M37": "36", "M38": "24",
}


# Cavity, amperage, fuse color as printed in the manual, description.
CARTRIDGE = [
    ("J1", 40, "Green", "Power folding seat"),
    ("J2", 30, "Pink", "Power liftgate module"),
    ("J3", 30, "Pink", "Rear door module"),
    ("J4", 25, "Natural", "Driver door node"),
    ("J5", 25, "Natural", "Passenger door node"),
    ("J6", 40, "Green", "Antilock brakes pump / stability control system"),
    ("J7", 30, "Pink", "Antilock brakes valve / stability control system"),
    ("J8", 40, "Green", "Power memory seat - if equipped"),
    ("J9", 40, "Green", "Partial Zero Emissions Vehicle motor / flex fuel - if equipped"),
    ("J10", 30, "Pink", "Headlamp wash / manifold tuning valve - if equipped"),
    ("J11", 30, "Pink", "Power sliding door module / anti-theft module - if equipped"),
    ("J12", 30, "Pink", "HVAC rear blower, radiator fan motor"),
    ("J13", 60, "Yellow", "Ignition-off draw (IOD) - main"),
    ("J14", 40, "Green", "Rear window defogger"),
    ("J15", 40, "Green", "Front blower"),
    ("J17", 40, "Green", "Starter solenoid"),
    ("J18", 20, "Blue", "Powertrain control module trans range"),
    ("J19", 60, "Yellow", "Radiator fan"),
    ("J20", 30, "Pink", "Front wiper low / high"),
    ("J21", 20, "Blue", "Front / rear washer"),
    ("J22", 25, "Natural", "Sunroof module"),
]

MINI = [
    ("M1", 15, "Blue", "Rear center brake lamp / brake switch"),
    ("M2", 20, "Yellow", "Trailer lighting, front fog lamps, intelligent battery sensor (IBS)"),
    ("M3", 20, "Yellow", "Front / rear axle locker, vacuum pump motor"),
    ("M4", 10, "Red", "Trailer tow"),
    ("M5", 25, "Natural", "Inverter"),
    ("M6", 20, "Yellow", "Power outlet #1 (ACC), rain sensor, cigar lighter; outlet location varies by configuration"),
    ("M7", 20, "Yellow", "Power outlet #2 (BATT / ACC SELECT), center seat or console-rear configuration"),
    ("M8", 20, "Yellow", "Front heated seat - if equipped"),
    ("M9", 20, "Yellow", "Rear heated seat - if equipped"),
    ("M10", 15, "Blue", "Ignition-off draw: video system, satellite radio, DVD, hands-free module, universal garage door opener, vanity lamp, streaming video module - if equipped"),
    ("M11", 10, "Red", "Climate control system"),
    ("M12", 30, "Green", "Amplifier / radio"),
    ("M13", 20, "Yellow", "Instrument cluster, SIREN, clock module, multi-function control switch - if equipped"),
    ("M14", 20, "Yellow", "Trailer tow - if equipped"),
    ("M15", 20, "Yellow", "Rear-view mirror, instrument cluster, multi-function control switch, tire-pressure monitor, glow-plug module - if equipped"),
    ("M16", 10, "Red", "Airbag module / occupant-classification module"),
    ("M17", 15, "Blue", "Left tail / license / park lamp, running lamps"),
    ("M18", 15, "Blue", "Right tail / park / running lamp"),
    ("M19", 25, "Natural", "Powertrain"),
    ("M20", 15, "Blue", "Instrument-cluster interior light, switch bank, steering-column module, steering-wheel switch"),
    ("M21", 20, "Yellow", "Powertrain"),
    ("M22", 10, "Red", "Horn"),
    ("M23", 10, "Red", "Horn"),
    ("M24", 25, "Natural", "Rear wiper"),
    ("M25", 20, "Yellow", "Fuel pump, diesel lift pump - if equipped"),
    ("M26", 10, "Red", "Power-mirror switch, driver-window switch"),
    ("M27", 10, "Red", "Wireless control module, keyless-entry module"),
    ("M28", 10, "Red", "Powertrain, transmission-control module"),
    ("M29", 10, "Red", "Occupant-classification module"),
    ("M30", 15, "Blue", "Rear-wiper module, power-folding mirror"),
    ("M31", 20, "Yellow", "Back-up lamps"),
    ("M32", 10, "Red", "Airbag module, THATCHUM - if equipped"),
    ("M33", 10, "Red", "Powertrain"),
    ("M34", 10, "Red", "Park assist, heater climate-control module, headlamp wash, compass, rear camera, door lamps, flashlight, diesel-heater / radiator-fan options - if equipped"),
    ("M35", 10, "Red", "Heated mirrors"),
    ("M36", 20, "Yellow", "Power outlet #3 (instrument panel or console center)"),
    ("M37", 10, "Red", "Antilock brakes, stability control, stop lamp, fuel pump"),
    ("M38", 25, "Natural", "Door lock / unlock motors, liftgate lock / unlock motors"),
]


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="Kicker", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=8, leading=10, textColor=ORANGE, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="TitleCustom", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=25, leading=28, textColor=INK, alignment=0, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="Subtitle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10, leading=14, textColor=MUTED, spaceAfter=10,
))
styles.add(ParagraphStyle(
    name="SectionCustom", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=15, leading=18, textColor=INK, spaceBefore=7, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="BodyCustom", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=9, leading=12, textColor=INK, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="SmallCustom", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=7.7, leading=10, textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="TableHeadCustom", parent=styles["BodyText"], fontName="Helvetica-Bold",
    fontSize=7.5, leading=9, textColor=WHITE,
))
styles.add(ParagraphStyle(
    name="TableCellCustom", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=7.8, leading=9.5, textColor=INK,
))
styles.add(ParagraphStyle(
    name="TableStrong", parent=styles["BodyText"], fontName="Helvetica-Bold",
    fontSize=8, leading=9.5, textColor=INK,
))


def para(text, style="BodyCustom"):
    return Paragraph(escape(text), styles[style])


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setStrokeColor(ORANGE)
    canvas.setLineWidth(1.2)
    canvas.line(MARGIN, height - 0.38 * inch, width - MARGIN, height - 0.38 * inch)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawString(MARGIN, height - 0.29 * inch, "2012 GRAND CARAVAN  /  TIPM FUSE REFERENCE")
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 0.38 * inch, width - MARGIN, 0.38 * inch)
    canvas.setFont("Helvetica", 6.7)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, 0.23 * inch, "Owner Guide printed pp. 578-584 | Verify against the vehicle's TIPM cover")
    canvas.drawRightString(width - MARGIN, 0.23 * inch, f"{doc.page}")
    canvas.restoreState()


def make_table(rows):
    head = [
        para("INDEX", "TableHeadCustom"),
        Paragraph("OEM<br/>CAVITY", styles["TableHeadCustom"]),
        para("FUSE", "TableHeadCustom"),
        para("CIRCUIT / ASSIGNMENT", "TableHeadCustom"),
    ]
    data = [head]
    for cavity, amp, color, description in rows:
        index = INDEX_BY_CAVITY[cavity]
        index_label = "-" if index == "-" else f"#{index}"
        data.append([
            para(index_label, "TableStrong"),
            para(cavity, "TableStrong"),
            para(f"{amp} A / {color}", "TableCellCustom"),
            para(description, "TableCellCustom"),
        ])
    table = Table(data, colWidths=[48, 57, 76, CONTENT_WIDTH - 181], repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 1), (2, -1), "LEFT"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, 0), 7),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 7),
        ("TOPPADDING", (0, 1), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 4),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, ROW]),
        ("BACKGROUND", (0, 12), (-1, 12), PALE_ORANGE) if rows is CARTRIDGE else
        ("BACKGROUND", (0, 0), (-1, 0), INK),
    ]))
    return table


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT), pagesize=letter,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=0.56 * inch, bottomMargin=0.55 * inch,
        title="2012 Dodge Grand Caravan TIPM Fuse Cavity Reference",
        author="Grand Caravan Interactive Guide",
        subject="Source-based under-hood fuse cavity and screenshot-index cross-reference",
    )

    story = [
        para("2012 DODGE GRAND CARAVAN  /  UNDER-HOOD POWER DISTRIBUTION", "Kicker"),
        para("TIPM fuse cavity guide", "TitleCustom"),
        para(
            "A printable cross-reference for the fuse labels in the Integrated Power Module (TIPM). "
            "It covers the owner's-manual cartridge (J) and mini-fuse (M) schedule.",
            "Subtitle",
        ),
    ]

    quick = Table([
        [para("USE THE COVER LABEL", "TableStrong"), para("USE THE SCREENSHOT INDEX", "TableStrong")],
        [para("J## = cartridge fuse; M## = mini-fuse. These are the cavity labels shown in the 2012 Owner's Manual schedule. Match the molded/printed code on your TIPM cover.", "BodyCustom"),
         para("#1-#58 = the sequence in the supplied StartMyCar fuse-list screenshots. The index helps find a row in this PDF; it is not an OEM cavity number or a spatial position.", "BodyCustom")],
    ], colWidths=[CONTENT_WIDTH / 2, CONTENT_WIDTH / 2])
    quick.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PANEL),
        ("BACKGROUND", (0, 1), (-1, 1), ROW),
        ("BOX", (0, 0), (-1, -1), 0.8, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.extend([quick, Spacer(1, 11)])

    j12_callout = Table([[
        Paragraph(
            "<b>KEEP J12 SEPARATE FROM SCREENSHOT #12.</b><br/>"
            "J12 is a 30 A cartridge cavity for the rear HVAC blower / radiator-fan motor. "
            "Screenshot index #12 maps to J14, a 40 A rear-window defogger circuit.",
            styles["BodyCustom"],
        )
    ]], colWidths=[CONTENT_WIDTH])
    j12_callout.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE_ORANGE),
        ("BOX", (0, 0), (-1, -1), 1, ORANGE),
        ("LINEBEFORE", (0, 0), (0, -1), 4, ORANGE),
        ("LEFTPADDING", (0, 0), (-1, -1), 11),
        ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.extend([j12_callout, Spacer(1, 9)])
    story.extend([
        para("Location and safe use", "SectionCustom"),
        para(
            "The Owner's Manual places the TIPM in the engine compartment near the battery. "
            "Use the diagram and label inside the vehicle's own cover to locate a physical cavity; "
            "this PDF is a lookup table, not a top-down slot map.",
        ),
        para(
            "Use only the specified fuse type and rating. If a correctly rated replacement opens again, "
            "the circuit needs diagnosis. Reinstall the cover fully latched. Optional-equipment listings "
            "may not apply to every van.",
        ),
        para(
            "This crosswalk matches the supplied #1-#58 list to Owner's Manual J/M cavity assignments by "
            "circuit and rating. The vehicle cover remains the final check. #43* is a cautious crosswalk "
            "match for M32; verify that code against your cover before acting.",
            "SmallCustom",
        ),
        Spacer(1, 5),
        para("Source documents", "SectionCustom"),
        Paragraph(
            f'Owner Guide: <link href="{OWNER_GUIDE}#page=581" color="#a64d24">'
            "official 2012 Mopar PDF, TIPM pages 578-584</link><br/>"
            f'Supplied list cross-check: <link href="{STARTMYCAR}" color="#a64d24">'
            "StartMyCar 2012 Grand Caravan fusebox page</link>",
            styles["SmallCustom"],
        ),
        para(
            "Independent user reference, not an OEM-issued publication. It does not include relay positions, "
            "connector pinouts, wire routing, or repair procedures. If this crosswalk and the vehicle cover "
            "disagree, follow the cover and vehicle-specific service information.",
            "SmallCustom",
        ),
        PageBreak(),
    ])

    story.extend([
        para("FUSE SCHEDULE  /  CARTRIDGE FUSES", "Kicker"),
        para("OEM J cavities", "TitleCustom"),
        para(
            "The index column refers to the supplied #1-#58 screenshot list. J12 is in the Owner's Manual "
            "schedule but has no number in that screenshot list.",
            "Subtitle",
        ),
        make_table(CARTRIDGE),
        Spacer(1, 6),
        para(
            "Source: 2012 Dodge Grand Caravan Owner's Manual, printed pp. 579-580. "
            "Cavity labels and descriptions are transcribed as a quick lookup; confirm the actual cover label.",
            "SmallCustom",
        ),
        PageBreak(),
        para("FUSE SCHEDULE  /  MINI-FUSES", "Kicker"),
        para("OEM M cavities · M1-M19", "TitleCustom"),
        para(
            "The M code is the cavity label; the # value is the separate supplied screenshot-list sequence.",
            "Subtitle",
        ),
        make_table(MINI[:19]),
        Spacer(1, 6),
        para("Source: 2012 Dodge Grand Caravan Owner's Manual, printed pp. 581-582.", "SmallCustom"),
        PageBreak(),
        para("FUSE SCHEDULE  /  MINI-FUSES", "Kicker"),
        para("OEM M cavities · M20-M38", "TitleCustom"),
        para(
            "Asterisk on #43* marks the cautious index-to-cavity crosswalk noted on page 1.",
            "Subtitle",
        ),
        make_table(MINI[19:]),
        Spacer(1, 6),
        para("Source: 2012 Dodge Grand Caravan Owner's Manual, printed pp. 583-584.", "SmallCustom"),
    ])

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"Wrote {OUTPUT}")
    print(f"Cartridge rows: {len(CARTRIDGE)}; mini-fuse rows: {len(MINI)}")


if __name__ == "__main__":
    build()
