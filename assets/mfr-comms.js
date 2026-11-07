/* Manufacturer communications verified for the 2012 Dodge Grand Caravan.
   Summaries are paraphrased from NHTSA's concise-summary field. Bulletin text is not copied. */
window.vehicleMfrComms={
  retrieved:'7 November 2026',
  source:'https://static.nhtsa.gov/odi/ffdd/tsbs/TSBS.txt',
  sourceLabel:'NHTSA manufacturer-communications file description',
  intro:'Checked three NHTSA flat files: communications received 2010–2014, 2015–2019, and 2020–2024. A row was kept only when make was Dodge, model was Grand Caravan, and model year was 2012. Twenty-nine later documents carried an electrical, lighting, or visibility component. The cards are the ones that change a driveway decision. Radio and hands-free software updates are grouped instead of copied. Two documents had no summary in the file. One row was tagged exterior lighting while its summary described a misfire and a cylinder-head check, so it is not listed as a lighting fix. This is not a recall list and not a ranking.',
  records:[
    {
      meta:'NHTSA ID 10051775 · document CSN-M-38 · manufacturer date 2013-01-01 · file received 2010–2014 · ELECTRICAL SYSTEM:SOFTWARE',
      title:'PCM software for shift quality',
      summary:'The public summary says updated PCM software was available because programming could cause poor automatic-transaxle shifts on 2011–2013 models. The same document is also filed under the powertrain control module. This card uses the 2012 Dodge Grand Caravan row. The file also names other 2011–2013 Dodge and Chrysler products for that document.',
      limit:'This is a shift-quality communication. It is not a fuse, TIPM, blower, or no-crank procedure. It does not prove a van has the condition, and it does not prove limp mode.',
      guide:'Limp mode / transmission stuck in one gear'
    },
    {
      meta:'NHTSA ID 10139651 · document 08-042-14 · manufacturer date 2014-04-23 · ELECTRICAL SYSTEM',
      title:'Fold-and-stow module can keep a battery awake',
      summary:'The public summary says the Fold and Stow module software could be updated because the module may stay awake and draw current. The customer effect named there is a dead battery.',
      limit:'A dead battery still has to be tested. This communication does not prove the module, the battery, or the TIPM failed on a particular van. It is not a fuse, and it is not permission to disconnect the battery while the engine is running.',
      guide:'Several electrical symptoms'
    },
    {
      meta:'NHTSA ID 10175735 · document 08-049-20 · manufacturer date 2020-04-22 · ELECTRICAL SYSTEM',
      title:'Battery and charging-system test equipment',
      summary:'The public summary describes an information bulletin about using the correct tools to test batteries and charging systems, and about warranty handling when a battery is replaced.',
      limit:'It does not name a failed alternator or a fuse. A no-crank van still starts with the battery and the connections, not with this bulletin number.'
    },
    {
      meta:'NHTSA IDs 10137029, 10137034, 10221066, 10229829, 10229898 · documents 08-046-14 and later revisions · VISIBILITY / ELECTRICAL SYSTEM',
      title:'Rear vent-window switch, tied to recall P25',
      summary:'The public summaries say a customer might ask to have the rear power-vent window switch disconnected after asking about Safety Recall P25, and that later notes point back to customer satisfaction notification P25.',
      limit:'The procedure is not copied here. Recall 14V234 / P25 is already in the recall snapshot, with its own build limits. A vent switch is not a blower fuse and not screenshot #12.'
    },
    {
      meta:'NHTSA ID 10128923 · document 08-053-12, plus 08-057-12 Rev. A, 08-021-13, 08-031-13, 08-027-14, 08-024-14, 08-031-16, Z5091195A, and 9003220',
      title:'Radio and hands-free software, grouped',
      summary:'Several 2012 Grand Caravan rows describe software updates for named radio families or the hands-free module: lost presets, distortion, prompts that start on their own, and Bluetooth or voice-command complaints. One of them says not to replace the radio for a hands-free complaint until the hands-free module is diagnosed.',
      limit:'These are equipment-software notes. An intact radio fuse does not prove the software, and a software bulletin does not prove the fuse. The symptom lists are not copied here.',
      guide:'Radio / amplifier dead'
    },
    {
      meta:'NHTSA ID 10217942 · document 9003081 · manufacturer date 2014-04-23 · ELECTRICAL SYSTEM',
      title:'Dielectric grease on coil boots',
      summary:'The public summary says this grease was no longer approved on ignition-coil and spark-plug boots, because the boot material and the grease can be a poor match.',
      limit:'It is not a fuse assignment and not a misfire diagnosis. Do not treat it as proof that a coil failed.'
    },
    {
      meta:'NHTSA ID 10219830 · document 9003109 · VISIBILITY:WINDSHIELD WIPER/WASHER',
      title:'Washer-fluid sensor before a new sensor',
      summary:'The public summary says a low-washer-fluid light with a full bottle should start with an inspection of the float sensor and how it sits in the bottle, before the sensor is replaced.',
      limit:'A warning light is not a failed sensor by itself. This is not a wiper-motor fuse diagnosis.',
      guide:'Wipers / washer'
    },
    {
      meta:'NHTSA ID 10244348 · document 9100226 · manufacturer date 2023-09-15 · ELECTRICAL SYSTEM:WIRING',
      title:'Connector repair kit may not match the diagram',
      summary:'The public summary says to confirm a connector repair kit on the Mopar connector-kit site before ordering, because an error in the service-library wiring diagrams was sending the wrong kit number.',
      limit:'That is a warning about factory service-library art, not a pinout this page can supply. This lab still does not publish an OEM wiring diagram.'
    },
    {
      meta:'NHTSA ID 10128692 · document TS-WI-0256 · manufacturer date 2018-01-12 · ELECTRICAL SYSTEM',
      title:'Mobility-equipment firmware, not the TIPM',
      summary:'The public summary describes a dealer firmware update for a VMI computer so a Powerkneel has enough current to trip its up-limit switch. That is conversion equipment filed on a Grand Caravan product row.',
      limit:'It is not the factory TIPM, a fuse cavity, or a blower circuit. It applies only to vans with that equipment. The bulletin body is not copied here.'
    }
  ]
};
