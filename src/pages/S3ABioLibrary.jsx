import React, { useState, useMemo } from 'react';

const S3BiologyLibrary = () => {
  const [activeTab, setActiveTab] = useState('registry');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Organism data
  const organisms = [
    // THERMOPHILIC FUNGI
    { id: 1, name: 'Thermomyces lanuginosus', category: 'Thermo Fungi', function: 'Thermophilic cellulase/xylanase producer — Wave 1', temp: '50–60', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$25', pricePerG: '0.025', doseLow: '0.05', doseHigh: '0.15', costLow: '4.38', costHigh: '13.13', icbb: '—', supplier: 'Alibaba/Novozymes' },
    { id: 2, name: 'Myceliophthora thermophila', category: 'Thermo Fungi', function: 'C1 cellulase system, industrial enzyme source — Wave 1', temp: '45–55', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$30', pricePerG: '0.030', doseLow: '0.05', doseHigh: '0.10', costLow: '5.25', costHigh: '10.50', icbb: '—', supplier: 'Novozymes Indonesia' },
    { id: 3, name: 'Chaetomium thermophilum', category: 'Thermo Fungi', function: 'Thermophilic cellulase, model organism — Wave 1', temp: '50–60', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$35', pricePerG: '0.035', doseLow: '0.03', doseHigh: '0.08', costLow: '3.68', costHigh: '9.80', icbb: '—', supplier: 'IPB Bogor / LIPI' },
    // THERMOPHILIC BACTERIA
    { id: 4, name: 'Geobacillus stearothermophilus', category: 'Thermo Bacteria', function: 'Thermophilic amylase/protease producer — Wave 1', temp: '55–70', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$15', pricePerG: '0.015', doseLow: '0.05', doseHigh: '0.15', costLow: '2.63', costHigh: '7.88', icbb: '—', supplier: 'IndiaMART' },
    { id: 5, name: 'Bacillus licheniformis', category: 'Thermo Bacteria', function: 'Thermotolerant protease/amylase — Wave 1 | 9-org: 0.04% DM locked', temp: '50–65', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$8', pricePerG: '0.008', doseLow: '0.05', doseHigh: '0.20', costLow: '1.40', costHigh: '5.60', icbb: '—', supplier: 'Alibaba bulk / Indotrading' },
    { id: 6, name: 'Thermobifida fusca', category: 'Thermo Actino', function: 'Thermophilic actinomycete, cellulase — Wave 1', temp: '50–55', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$40', pricePerG: '0.040', doseLow: '0.02', doseHigh: '0.05', costLow: '2.80', costHigh: '7.00', icbb: '—', supplier: 'ATCC / DSMZ' },
    // LIGNIN FUNGI
    { id: 7, name: 'Phanerochaete sp.', category: 'Fungi', function: 'Primary lignin destroyer (LiP, MnP, Laccase)', temp: '25–42', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$8', pricePerG: '0.008', doseLow: '0.05', doseHigh: '0.15', costLow: '4.00', costHigh: '8.00', icbb: 'ICBB 9182', supplier: 'IPB Bogor ICBB' },
    { id: 8, name: 'Phanerochaete chrysosporium', category: 'Fungi', function: 'Strongest lignin degrader (wild-type)', temp: '37–42', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$8', pricePerG: '0.008', doseLow: '0.05', doseHigh: '0.15', costLow: '4.00', costHigh: '8.00', icbb: 'Wild-type', supplier: 'IPB / LIPI Cibinong' },
    { id: 9, name: 'Pleurotus ostreatus', category: 'Fungi', function: 'Selective lignin degrader (preserves cellulose)', temp: '20–28', bsfSafe: 'no', form: 'Wet', pricePerKg: '$0.30', pricePerG: '0.0003', doseLow: '0.05', doseHigh: '0.15', costLow: '0.15', costHigh: '0.30', icbb: '—', supplier: "Tokopedia 'bibit jamur'" },
    { id: 10, name: 'Trametes versicolor', category: 'Fungi', function: 'Laccase producer, lignin oxidation', temp: '25–30', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$2', pricePerG: '0.002', doseLow: '0.03', doseHigh: '0.10', costLow: '0.60', costHigh: '1.40', icbb: '—', supplier: 'Tokopedia / Alibaba' },
    { id: 11, name: 'Ganoderma lucidum', category: 'Fungi', function: 'Lignin degrader — CAUTION: palm pathogen', temp: '25–30', bsfSafe: 'warn', form: 'Wet', pricePerKg: '$1.50', pricePerG: '0.0015', doseLow: '0.03', doseHigh: '0.08', costLow: '0.45', costHigh: '0.84', icbb: '—', supplier: 'Tokopedia' },
    { id: 12, name: 'Trichoderma harzianum / sp.', category: 'Fungi', function: 'Aggressive cellulase + Ganoderma biocontrol. Wave 1B/2 ONLY in 9-org stack', temp: '25–35', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$1.50', pricePerG: '0.0015', doseLow: '0.05', doseHigh: '0.15', costLow: '0.75', costHigh: '1.50', icbb: 'ICBB 9127', supplier: 'Tokopedia bulk' },
    { id: 13, name: 'Aspergillus niger', category: 'Fungi', function: 'Industrial cellulase/pectinase. Wave 1A in 9-org stack', temp: '30–37', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$5', pricePerG: '0.005', doseLow: '0.03', doseHigh: '0.10', costLow: '1.50', costHigh: '3.50', icbb: '—', supplier: 'Alibaba / IndiaMART' },
    { id: 14, name: 'Aspergillus oryzae', category: 'Fungi', function: 'Koji mold, amylase/protease', temp: '30–35', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$3', pricePerG: '0.003', doseLow: '0.05', doseHigh: '0.15', costLow: '1.50', costHigh: '3.00', icbb: '—', supplier: "Tokopedia 'koji'" },
    // YEAST
    { id: 15, name: 'Saccharomyces cerevisiae', category: 'Yeast', function: 'Anti-odour, N-conservation (50% NH₃ retention)', temp: '25–35', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$0.30', pricePerG: '0.0003', doseLow: '0.05', doseHigh: '0.20', costLow: '0.12', costHigh: '0.45', icbb: 'ICBB 8808', supplier: 'Fermipan retail' },
    // BACTERIA
    { id: 16, name: 'Microbacterium lactium', category: 'Bacteria', function: 'Primary cellulose decomposer → glucose', temp: '30–40', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$3', pricePerG: '0.003', doseLow: '0.05', doseHigh: '0.10', costLow: '1.50', costHigh: '2.40', icbb: 'ICBB 7125', supplier: 'Jaipur Bio India' },
    { id: 17, name: 'Paenibacillus macerans', category: 'Bacteria', function: 'Hemicellulase + nif genes', temp: '30–45', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$3', pricePerG: '0.003', doseLow: '0.05', doseHigh: '0.10', costLow: '1.50', costHigh: '2.40', icbb: 'ICBB 8810', supplier: 'MarkNature / IPB' },
    { id: 18, name: 'Bacillus subtilis', category: 'Bacteria', function: 'PGPR, endospore shelf-life. Wave 1 in 9-org stack', temp: '25–50', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$0.20', pricePerG: '0.0002', doseLow: '0.03', doseHigh: '0.05', costLow: '0.06', costHigh: '0.10', icbb: 'ICBB 8780', supplier: 'Ansel Biotech India' },
    { id: 19, name: 'Lactobacillus sp. (EM-4)', category: 'Bacteria', function: 'LAB pH buffering 5.5–6.0. Wave 1 in 9-org stack', temp: '25–40', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$0.86', pricePerG: '0.00086', doseLow: '0.03', doseHigh: '0.10', costLow: '0.05', costHigh: '0.17', icbb: 'ICBB 6099', supplier: 'EM-4 retail Rp25k/L' },
    { id: 20, name: 'Bacillus megaterium', category: 'Bacteria', function: 'P-solubiliser (gluconic acid)', temp: '25–37', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$1.50', pricePerG: '0.0015', doseLow: '0.03', doseHigh: '0.05', costLow: '0.45', costHigh: '0.75', icbb: '—', supplier: 'IndiaMART' },
    { id: 21, name: 'Cellulomonas fimi', category: 'Bacteria', function: 'Cellulolytic bacterium', temp: '30–37', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$4', pricePerG: '0.004', doseLow: '0.03', doseHigh: '0.08', costLow: '1.20', costHigh: '2.24', icbb: '—', supplier: 'ATCC / IndiaMART' },
    // N-FIXERS
    { id: 22, name: 'Azotobacter vinelandii', category: 'N-Fixer', function: 'Free-living N₂ fixer: 10–20 mg N/kg/day — HIGHEST. Wave 2 / Day 3+', temp: '<50 ⚠️', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$0.40', pricePerG: '0.0004', doseLow: '0.05', doseHigh: '0.20', costLow: '0.20', costHigh: '0.60', icbb: 'ICBB 9098', supplier: 'HumicFactory India' },
    { id: 23, name: 'Azospirillum lipoferum', category: 'N-Fixer', function: 'Associative N-fixer + IAA phytohormone. Wave 2', temp: '<50 ⚠️', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$1', pricePerG: '0.001', doseLow: '0.05', doseHigh: '0.10', costLow: '0.50', costHigh: '0.80', icbb: 'ICBB 6088', supplier: 'Jaipur Bio India' },
    { id: 24, name: 'Bradyrhizobium japonicum', category: 'N-Fixer', function: 'Root-nodule N-fixer (soil phase). Wave 2', temp: '<45', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$1.50', pricePerG: '0.0015', doseLow: '0.03', doseHigh: '0.05', costLow: '0.45', costHigh: '0.75', icbb: 'ICBB 9251', supplier: 'Pioneer Agro India' },
    // P/K SOLUBILISERS
    { id: 25, name: 'Pseudomonas fluorescens', category: 'P-Solubiliser', function: 'P-solubiliser + HCN biocontrol vs Ganoderma', temp: '25–30', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$2.40', pricePerG: '0.0024', doseLow: '0.05', doseHigh: '0.10', costLow: '1.20', costHigh: '1.92', icbb: '—', supplier: 'Katyayani India' },
    { id: 26, name: 'Bacillus coagulans', category: 'P-Solubiliser', function: 'P-solubiliser, probiotic. Wave 1 in 9-org stack', temp: '35–50', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$4.50', pricePerG: '0.002', doseLow: '0.03', doseHigh: '0.08', costLow: '0.60', costHigh: '1.12', icbb: '—', supplier: 'Alibaba' },
    { id: 27, name: 'Bacillus mucilaginosus', category: 'K-Mobiliser', function: 'K-solubiliser from silicates', temp: '25–37', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$3', pricePerG: '0.003', doseLow: '0.03', doseHigh: '0.08', costLow: '0.90', costHigh: '1.68', icbb: '—', supplier: 'IndiaMART' },
    { id: 28, name: 'Frateuria aurantia', category: 'K-Mobiliser', function: 'K-mobiliser specialist', temp: '25–30', bsfSafe: 'yes', form: 'Wet', pricePerKg: '$4', pricePerG: '0.004', doseLow: '0.03', doseHigh: '0.05', costLow: '1.20', costHigh: '1.60', icbb: '—', supplier: 'IARI India' },
    // ACTINOMYCETES
    { id: 29, name: 'Streptomyces sp.', category: 'Actinomycete', function: 'Lignocellulolytic + antibiotic production', temp: '25–37', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$5', pricePerG: '0.005', doseLow: '0.02', doseHigh: '0.05', costLow: '1.00', costHigh: '2.00', icbb: 'ICBB 9155', supplier: 'IPB ICBB' },
    { id: 30, name: 'Streptomyces sp.', category: 'Actinomycete', function: 'Complementary antibiotic profile', temp: '25–37', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$5', pricePerG: '0.005', doseLow: '0.02', doseHigh: '0.05', costLow: '1.00', costHigh: '2.00', icbb: 'ICBB 9469', supplier: 'IPB ICBB' },
    // CONDITIONAL
    { id: 31, name: 'Bacillus thuringiensis (Bt)', category: 'Conditional', function: 'S3 ONLY — titre decay <10⁴ CFU/g before S4. Cry proteins toxic to Diptera larvae', temp: '25–45', bsfSafe: 'warn', form: 'Dry', pricePerKg: '$0.15', pricePerG: '0.00015', doseLow: '—', doseHigh: '—', costLow: '—', costHigh: '—', icbb: 'ICBB 6095', supplier: 'IPB ICBB — USE WITH CAUTION' },
    // ENZYMES
    { id: 32, name: 'Cellulase (T. reesei)', category: 'Enzyme', function: 'β-1,4-glycosidic → glucose; +35–45% IVDMD', temp: '45–55', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$15', pricePerG: '0.015', doseLow: '0.01', doseHigh: '0.05', costLow: '1.58', costHigh: '7.88', icbb: 'EC 3.2.1.4', supplier: 'Novozymes Indonesia' },
    { id: 33, name: 'Xylanase', category: 'Enzyme', function: 'β-1,4-xylosidic → xylose; strips hemi shield', temp: '40–55', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$17', pricePerG: '0.017', doseLow: '0.01', doseHigh: '0.05', costLow: '1.36', costHigh: '7.14', icbb: 'EC 3.2.1.8', supplier: 'Alibaba bulk' },
    { id: 34, name: 'Laccase', category: 'Enzyme', function: 'Phenolic detoxification; opens lignin surface', temp: '30–50', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$20', pricePerG: '0.020', doseLow: '0.01', doseHigh: '0.03', costLow: '1.00', costHigh: '4.20', icbb: 'EC 1.10.3.2', supplier: 'Alibaba bulk' },
    { id: 35, name: 'Pectinase', category: 'Enzyme', function: 'Pectin breakdown; softens cell walls', temp: '40–50', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$12', pricePerG: '0.012', doseLow: '0.005', doseHigh: '0.02', costLow: '0.42', costHigh: '1.68', icbb: 'EC 3.2.1.15', supplier: 'Alibaba bulk' },
    { id: 36, name: 'Lipase', category: 'Enzyme', function: 'Fat breakdown; relevant for OPDC 3–8% lipid', temp: '35–45', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$18', pricePerG: '0.018', doseLow: '0.005', doseHigh: '0.02', costLow: '0.63', costHigh: '2.52', icbb: 'EC 3.1.1.3', supplier: 'Novozymes' },
    { id: 37, name: 'Protease', category: 'Enzyme', function: 'Protein accessibility for BSF', temp: '40–55', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$10', pricePerG: '0.010', doseLow: '0.005', doseHigh: '0.02', costLow: '0.35', costHigh: '1.40', icbb: 'EC 3.4.x.x', supplier: 'Alibaba bulk' },
    { id: 38, name: 'Amylase', category: 'Enzyme', function: 'Starch → glucose', temp: '55–70', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$8', pricePerG: '0.008', doseLow: '0.01', doseHigh: '0.03', costLow: '0.56', costHigh: '1.68', icbb: 'EC 3.2.1.1', supplier: 'Alibaba bulk' },
    { id: 39, name: 'Mannanase', category: 'Enzyme', function: 'Mannan breakdown (palm kernel)', temp: '45–55', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$22', pricePerG: '0.022', doseLow: '0.005', doseHigh: '0.02', costLow: '0.77', costHigh: '3.08', icbb: 'EC 3.2.1.78', supplier: 'Alibaba / DSM' },
    { id: 40, name: 'β-glucosidase', category: 'Enzyme', function: 'Final cellulose step → glucose', temp: '45–55', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$25', pricePerG: '0.025', doseLow: '0.005', doseHigh: '0.015', costLow: '0.88', costHigh: '2.63', icbb: 'EC 3.2.1.21', supplier: 'Novozymes' },
    // NEW MAR 2026
    { id: 41, name: 'Rhizopus oligosporus', category: 'Fungi', function: 'Fast mycelial protein — protease + lipase + phytase. Wave 1A Day 0. Vulnerable to Trichoderma', temp: '28–37', bsfSafe: 'yes', form: 'Dry', pricePerKg: '$0.50', pricePerG: '0.0005', doseLow: '0.05', doseHigh: '0.15', costLow: '0.09', costHigh: '0.26', icbb: '—', supplier: 'Tokopedia / IndiaMART' },
    { id: 42, name: 'Arthrospira platensis (Spirulina)', category: 'Algae', function: '1,850 L/t EFB DM. 65% CP. Neonate BSF +22%. FCR −0.7. BSF meal 45%→56% CP', temp: '25–38', bsfSafe: 'yes', form: 'Slurry', pricePerKg: '$0', pricePerG: '$0', doseLow: '1,850 L/t DM', doseHigh: '1,850 L/t DM', costLow: '$0', costHigh: '$0', icbb: '—', supplier: 'On-site POME raceway' },
    { id: 43, name: 'Chlorella vulgaris', category: 'Algae', function: '1,850 L/t EFB DM. 45% CP. Neonate BSF +15%. FCR −0.5. BSF meal 45%→51% CP', temp: '20–30', bsfSafe: 'yes', form: 'Slurry', pricePerKg: '$0', pricePerG: '$0', doseLow: '1,850 L/t DM', doseHigh: '1,850 L/t DM', costLow: '$0', costHigh: '$0', icbb: '—', supplier: 'On-site POME raceway' },
  ];

  const filteredOrganisms = useMemo(() => {
    return organisms.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || org.category.toLowerCase().includes(categoryFilter.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const styles = `
    :root {
      --navy:        #0B1422;
      --navyMid:     #153352;
      --navyLt:      #1A3A5C;
      --navyDk:      #070D16;
      --teal:        #00C9B1;
      --tealDk:      #009E8C;
      --tealLt:      #5EEADA;
      --amber:       #F5A623;
      --amberLt:     #FFD080;
      --red:         #E84040;
      --green:       #3DCB7A;
      --blue:        #4A9EDB;
      --purple:      #9B59B6;
      --white:       #F0F4F8;
      --grey:        #8BA0B4;
      --greyLt:      #C4D3E0;
      --greyMd:      #A8B8C7;
      --pastelGreen: #A8E6C1;
      --border:      #1E6B8C;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      font-family: 'DM Sans', sans-serif;
      background: #070D16;
      color: var(--white);
    }

    /* ══════════════════════════════════════════════════
       GLOBAL HEADER
       ══════════════════════════════════════════════════ */
    .global-header {
      background: var(--navyMid);
      border-bottom: 1px solid rgba(51,212,188,0.15);
      display: flex;
      align-items: center;
      padding: 0 32px;
      height: 83px;
      gap: 0;
    }

    .brand-block {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .brand-name {
      font-family: 'EB Garamond', serif;
      font-weight: 700;
      font-size: 26px;
      letter-spacing: 0.06em;
      line-height: 1;
    }

    .brand-cfi {
      color: var(--white);
    }

    .brand-deeptech {
      color: #33D4BC;
      margin-left: 10px;
    }

    .brand-divider {
      width: 3px;
      height: 44px;
      background: #33D4BC;
      margin: 0 20px 0 14px;
      flex-shrink: 0;
    }

    .taglines-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
      height: 44px;
    }

    .tagline {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.3;
      white-space: nowrap;
      display: flex;
      align-items: baseline;
    }

    .tagline-segment {
      font-weight: 700;
    }

    .tagline-white {
      color: var(--white);
      min-width: 150px;
      display: inline-block;
    }

    .tagline-teal {
      color: #33D4BC;
    }

    /* ══════════════════════════════════════════════════
       PAGE HEADER
       ══════════════════════════════════════════════════ */
    .page-header {
      background: var(--navyMid);
      border-bottom: 1.5px solid var(--border);
      padding: 16px 24px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 200;
    }

    .page-header-left h1 {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: var(--teal);
      letter-spacing: .4px;
    }

    .page-header-left .sub {
      font-size: 11px;
      color: var(--grey);
      margin-top: 3px;
    }

    .header-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }

    .badge {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 11px;
      padding: 3px 11px;
      border-radius: 20px;
      white-space: nowrap;
      border: 1px solid;
    }

    .badge-teal {
      background: rgba(0,201,177,.12);
      color: var(--teal);
      border-color: var(--teal);
    }

    .badge-amber {
      background: rgba(245,166,35,.12);
      color: var(--amber);
      border-color: var(--amber);
    }

    .badge-red {
      background: rgba(232,64,64,.12);
      color: var(--red);
      border-color: var(--red);
    }

    .badge-green {
      background: rgba(61,203,122,.12);
      color: var(--green);
      border-color: var(--green);
    }

    /* ══════════════════════════════════════════════════
       TABS
       ══════════════════════════════════════════════════ */
    .tabs {
      display: flex;
      gap: 4px;
      background: var(--navy);
      border-bottom: 1.5px solid var(--border);
      padding: 0 16px;
      overflow-x: auto;
    }

    .tab {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.01em;
      padding: 8px 14px;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
    }

    .tab.active {
      color: var(--teal);
      border-bottom-color: var(--teal);
    }

    .tab:not(.active) {
      color: rgba(168,189,208,0.55);
    }

    .tab:not(.active):hover {
      color: rgba(168,189,208,0.85);
    }

    /* ══════════════════════════════════════════════════
       CONTENT AREA
       ══════════════════════════════════════════════════ */
    .content {
      background: var(--navyDk);
      min-height: calc(100vh - 200px);
    }

    .tab-panel {
      display: none;
    }

    .tab-panel.active {
      display: block;
    }

    .section {
      margin: 0;
      border-bottom: 1.5px solid var(--border);
      overflow: hidden;
    }

    .section-header {
      padding: 12px 16px;
      background: var(--navyLt);
      border-bottom: 1.5px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: .3px;
    }

    .section-title.teal {
      color: var(--teal);
    }

    .section-title.amber {
      color: var(--amber);
    }

    .section-title.red {
      color: var(--red);
    }

    .section-title.green {
      color: var(--green);
    }

    .section-body {
      padding: 0;
    }

    /* ══════════════════════════════════════════════════
       ALERT BANNERS
       ══════════════════════════════════════════════════ */
    .alert {
      margin: 14px 16px;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 12px;
      border: 1.5px solid var(--border);
      line-height: 1.6;
    }

    .alert-red {
      background: rgba(232,64,64,.12);
      color: var(--red);
    }

    .alert-amber {
      background: rgba(245,166,35,.12);
      color: var(--amber);
    }

    .alert-green {
      background: rgba(61,203,122,.12);
      color: var(--green);
    }

    .alert-teal {
      background: rgba(0,201,177,.08);
      color: var(--tealLt);
    }

    .alert strong {
      font-weight: 700;
    }

    /* ══════════════════════════════════════════════════
       SEARCH & FILTER
       ══════════════════════════════════════════════════ */
    .search-bar {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(30,107,140,.2);
    }

    .search-bar input {
      width: 100%;
      background: var(--navyDk);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 8px 12px;
      color: var(--white);
      font-size: 12px;
      font-family: 'DM Mono', monospace;
      margin-bottom: 12px;
    }

    .search-bar input::placeholder {
      color: rgba(168,189,208,0.5);
    }

    .search-bar input:focus {
      outline: none;
      border-color: var(--teal);
    }

    .filter-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-btn {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 16px;
      border: 1px solid;
      cursor: pointer;
      transition: all 0.15s;
      background: var(--navyDk);
      color: rgba(168,189,208,0.6);
      border-color: rgba(168,189,208,0.3);
    }

    .filter-btn.active-teal {
      background: rgba(0,201,177,.15);
      color: var(--teal);
      border-color: var(--teal);
    }

    .filter-btn:hover {
      border-color: var(--teal);
      color: var(--teal);
    }

    /* ══════════════════════════════════════════════════
       TABLES
       ══════════════════════════════════════════════════ */
    .tbl-wrap {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    thead tr {
      background: var(--navyDk);
      border-bottom: 1.5px solid var(--border);
    }

    thead th {
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 11px;
      color: var(--greyMd);
      text-align: center;
      padding: 8px 10px;
      white-space: nowrap;
      border-right: 1px solid rgba(30,107,140,.3);
    }

    thead th:last-child {
      border-right: none;
    }

    thead th.left {
      text-align: left;
    }

    tbody tr {
      border-bottom: 1px solid rgba(30,107,140,.2);
    }

    tbody tr:hover {
      background: rgba(26,58,92,.4);
    }

    tbody td {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      color: var(--greyMd);
      text-align: center;
      padding: 7px 10px;
      vertical-align: top;
      border-right: 1px solid rgba(30,107,140,.15);
    }

    tbody td:last-child {
      border-right: none;
    }

    tbody td.left {
      text-align: left;
    }

    tbody td.name {
      font-family: 'DM Mono', monospace;
      font-weight: 700;
      font-size: 11px;
      color: var(--amber);
      text-align: left;
    }

    tbody td.cat {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      color: var(--teal);
      text-align: left;
    }

    tbody td.fn {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      color: var(--greyLt);
      text-align: left;
      min-width: 200px;
    }

    tbody td.note {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      color: var(--grey);
      text-align: left;
      min-width: 220px;
      line-height: 1.5;
    }

    tbody td.num {
      font-family: 'DM Mono', monospace;
      font-weight: 700;
      font-size: 11px;
      color: var(--green);
      text-align: center;
    }

    tbody td.price {
      font-family: 'DM Mono', monospace;
      font-weight: 700;
      font-size: 11px;
      color: var(--amberLt);
      text-align: center;
    }

    tbody tr.total-row td {
      font-family: 'DM Mono', monospace;
      font-weight: 700;
      font-size: 12px;
      color: var(--pastelGreen);
      background: rgba(0,0,0,.3);
      border-top: 1.5px solid var(--border);
    }

    tbody tr.wave2-row {
      background: rgba(0,30,60,.5);
    }

    tbody tr.algae-row {
      background: rgba(0,50,30,.5);
    }

    tbody tr.warning-row {
      background: rgba(80,0,0,.4);
    }

    tbody tr.amber-row {
      background: rgba(80,40,0,.35);
    }

    /* ══════════════════════════════════════════════════
       PILL TAGS
       ══════════════════════════════════════════════════ */
    .pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 20px;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 700;
      white-space: nowrap;
    }

    .pill-teal {
      background: rgba(0,201,177,.15);
      color: var(--teal);
      border: 1px solid var(--teal);
    }

    .pill-amber {
      background: rgba(245,166,35,.15);
      color: var(--amber);
      border: 1px solid var(--amber);
    }

    .pill-red {
      background: rgba(232,64,64,.2);
      color: var(--red);
      border: 1px solid var(--red);
    }

    .pill-green {
      background: rgba(61,203,122,.15);
      color: var(--green);
      border: 1px solid var(--green);
    }

    .pill-grey {
      background: rgba(139,160,180,.15);
      color: var(--grey);
      border: 1px solid var(--grey);
    }

    .pill-blue {
      background: rgba(74,158,219,.15);
      color: var(--blue);
      border: 1px solid var(--blue);
    }

    /* ══════════════════════════════════════════════════
       BOOLEAN DOTS
       ══════════════════════════════════════════════════ */
    .dot-yes {
      color: var(--green);
      font-size: 14px;
    }

    .dot-no {
      color: rgba(139,160,180,.4);
      font-size: 14px;
    }

    .dot-warn {
      color: var(--amber);
      font-size: 14px;
    }

    /* ══════════════════════════════════════════════════
       METRICS
       ══════════════════════════════════════════════════ */
    .metrics {
      display: flex;
      gap: 12px;
      padding: 14px 16px;
      flex-wrap: wrap;
    }

    .metric {
      background: var(--navyDk);
      border: 1.5px solid var(--border);
      border-radius: 6px;
      padding: 10px 16px;
      min-width: 140px;
      flex: 1;
    }

    .metric-label {
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 11px;
      color: var(--grey);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: .5px;
    }

    .metric-value {
      font-family: 'DM Mono', monospace;
      font-weight: 700;
      font-size: 18px;
      color: var(--amber);
    }

    .metric-unit {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      color: var(--greyMd);
      margin-top: 1px;
    }

    .metric-value.green {
      color: var(--green);
    }

    .metric-value.teal {
      color: var(--teal);
    }

    .metric-value.red {
      color: var(--red);
    }

    /* ══════════════════════════════════════════════════
       PLACEHOLDER SECTIONS
       ══════════════════════════════════════════════════ */
    .placeholder-section {
      padding: 40px;
      text-align: center;
      color: var(--grey);
    }

    .placeholder-section h2 {
      color: var(--teal);
      margin-bottom: 16px;
      font-family: 'Syne', sans-serif;
    }

    @media (max-width: 1200px) {
      table {
        font-size: 10px;
      }

      thead th,
      tbody td {
        padding: 6px 8px;
      }
    }
  `;

  const renderDot = (type) => {
    switch(type) {
      case 'yes': return <span className="dot-yes">●</span>;
      case 'no': return <span className="dot-no">●</span>;
      case 'warn': return <span className="dot-warn">●</span>;
      default: return null;
    }
  };

  return (
    <div>
      <style>{styles}</style>

      {/* Global Header */}
      <div className="global-header">
        <div className="brand-block">
          <span className="brand-name brand-cfi">CFI</span>
          <span className="brand-name brand-deeptech">Deep Tech</span>
        </div>
        <div className="brand-divider"></div>
        <div className="taglines-block">
          <div className="tagline">
            <span className="tagline-segment tagline-white">Precision Engineering</span>
            <span className="tagline-segment tagline-teal">Circular Nutrient Recovery in Agricultural Systems</span>
          </div>
          <div className="tagline">
            <span className="tagline-segment tagline-white">Applied Biology</span>
            <span className="tagline-segment tagline-teal">Rebalancing Soil's Microbiome & Reducing Synthetic Fertiliser Use</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>S3 — Biological Inoculation Library</h1>
        </div>
        <div className="header-badges">
          <span className="badge badge-teal">43 Organisms + Enzymes</span>
          <span className="badge badge-amber">8,157 t FW/month</span>
          <span className="badge badge-red">Bt ICBB 6095 — Conditional</span>
          <span className="badge badge-green">5-Day Bio Minimum</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        {['registry', 'suppliers', 'dosage', 'consortium', 'timeline', 'handoff', 'algae', 'oneshot', 'gas', 'pksa', 'refs'].map(tabName => (
          <div
            key={tabName}
            className={`tab ${activeTab === tabName ? 'active' : ''}`}
            onClick={() => setActiveTab(tabName)}
          >
            {tabName === 'registry' && 'Organism Registry'}
            {tabName === 'suppliers' && 'Suppliers'}
            {tabName === 'dosage' && 'Dosage Calculator'}
            {tabName === 'consortium' && 'Consortium Groups'}
            {tabName === 'timeline' && 'Inoculation Timeline'}
            {tabName === 'handoff' && 'BSF Handoff Gate'}
            {tabName === 'algae' && 'Algae Hydrator'}
            {tabName === 'oneshot' && 'One-Shot Protocol'}
            {tabName === 'gas' && 'Gas Emissions'}
            {tabName === 'pksa' && 'Potassium PKSA'}
            {tabName === 'refs' && 'References'}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="content">
        {/* TAB: ORGANISM REGISTRY */}
        <div className={`tab-panel ${activeTab === 'registry' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title amber">Section A: Complete Organism Registry</span>
              <span className="badge badge-green">Calculated Output</span>
            </div>
            <div className="alert alert-red">
              <strong>Critical Safety Rule:</strong> Bacillus thuringiensis (Bt) ICBB 6095 is <strong>CONDITIONAL — S3 Phase Only</strong>. Hard gate before S4 BSF loading: titre MUST decay to &lt;10⁴ CFU/g confirmed by lab. Cry proteins are <strong>TOXIC TO DIPTERA</strong> including Hermetia illucens BSF larvae.
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search organism name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="filter-pills">
                <button
                  className={`filter-btn ${categoryFilter === 'all' ? 'active-teal' : ''}`}
                  onClick={() => setCategoryFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${categoryFilter === 'thermo' ? 'active-teal' : ''}`}
                  onClick={() => setCategoryFilter('thermo')}
                >
                  Thermophilic
                </button>
                <button
                  className={`filter-btn ${categoryFilter === 'fungi' ? 'active-teal' : ''}`}
                  onClick={() => setCategoryFilter('fungi')}
                >
                  Fungi
                </button>
                <button
                  className={`filter-btn ${categoryFilter === 'bacteria' ? 'active-teal' : ''}`}
                  onClick={() => setCategoryFilter('bacteria')}
                >
                  Bacteria
                </button>
                <button
                  className={`filter-btn ${categoryFilter === 'nfixer' ? 'active-teal' : ''}`}
                  onClick={() => setCategoryFilter('nfixer')}
                >
                  N-Fixers
                </button>
                <button
                  className={`filter-btn ${categoryFilter === 'enzyme' ? 'active-teal' : ''}`}
                  onClick={() => setCategoryFilter('enzyme')}
                >
                  Enzymes
                </button>
                <button
                  className={`filter-btn ${categoryFilter === 'algae' ? 'active-teal' : ''}`}
                  onClick={() => setCategoryFilter('algae')}
                >
                  Algae
                </button>
              </div>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '28px' }}>#</th>
                    <th className="left">Organism Name</th>
                    <th className="left">Category</th>
                    <th className="left">Primary Function</th>
                    <th>Temp °C</th>
                    <th>BSF Safe</th>
                    <th>Form</th>
                    <th>$/kg</th>
                    <th>$/g</th>
                    <th>Dose Low % DM</th>
                    <th>Dose High % DM</th>
                    <th>Cost Low $/t FW</th>
                    <th>Cost High $/t FW</th>
                    <th>ICBB</th>
                    <th>Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrganisms.map(org => (
                    <tr key={org.id}>
                      <td className="num">{org.id}</td>
                      <td className="name">{org.name}</td>
                      <td className="cat">{org.category}</td>
                      <td className="fn">{org.function}</td>
                      <td className="num">{org.temp}</td>
                      <td>{renderDot(org.bsfSafe)}</td>
                      <td>{org.form}</td>
                      <td className="price">{org.pricePerKg}</td>
                      <td>{org.pricePerG}</td>
                      <td>{org.doseLow}</td>
                      <td>{org.doseHigh}</td>
                      <td className="num">{org.costLow}</td>
                      <td className="num">{org.costHigh}</td>
                      <td>{org.icbb}</td>
                      <td>{org.supplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TAB: SUPPLIERS */}
        <div className={`tab-panel ${activeTab === 'suppliers' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title teal">Section F: Approved Suppliers & Sourcing</span>
              <span className="badge badge-amber">Reference Only</span>
            </div>
          </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title teal">Section J: Suppliers — 33 Organisms + Enzymes By Region</span>
      <span className="badge badge-amber">Calculated</span>
    </div>
    <div className="alert alert-teal">Priority: Indonesia (fastest) → SE Asia → India (cheapest) → China (bulk). Lead time = days from order to delivery FOB Indonesia. MOQ = Minimum Order Quantity.</div>
    <div className="tbl-wrap">
      <table>
        <thead><tr><th>#</th><th className="left">Organism / Enzyme</th><th className="left">Category</th><th className="left">Indonesia Supplier</th><th>Indo Lead</th><th>Indo MOQ</th><th className="left">SE Asia Supplier</th><th>SEA Lead</th><th className="left">India Supplier</th><th>India Lead</th><th>India $/kg</th><th className="left">China Supplier</th><th>China Lead</th><th className="left">Best Quote</th></tr></thead>
        <tbody>
          <tr><td className="num">1</td><td className="name">Thermomyces lanuginosus</td><td className="cat">Thermo</td><td>IPB Bogor Lab</td><td>14–21d</td><td>100g</td><td>MARDI Malaysia</td><td>21–28d</td><td>NCIM Pune</td><td>14–21d</td><td className="price">$25</td><td>Alibaba ferment</td><td>21–30d</td><td className="note">ipb.ac.id/biotek</td></tr>
          <tr><td className="num">2</td><td className="name">Myceliophthora thermophila</td><td className="cat">Thermo</td><td>—</td><td>—</td><td>—</td><td>DSM Singapore</td><td>7–14d</td><td>Novozymes India</td><td>14–21d</td><td className="price">$30</td><td>—</td><td>—</td><td className="note">novozymes.com</td></tr>
          <tr><td className="num">3</td><td className="name">Geobacillus stearothermophilus</td><td className="cat">Thermo</td><td>LIPI Cibinong</td><td>14–21d</td><td>100g</td><td>—</td><td>—</td><td>IndiaMART bulk</td><td>7–14d</td><td className="price">$15</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">indiamart.com</td></tr>
          <tr><td className="num">4</td><td className="name">Bacillus licheniformis</td><td className="cat">Thermo</td><td>Indotrading</td><td>3–7d</td><td>1kg</td><td>—</td><td>—</td><td>Jaipur Bio</td><td>7–14d</td><td className="price">$8</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">indotrading.com</td></tr>
          <tr><td className="num">5</td><td className="name">Phanerochaete sp. ICBB 9182</td><td className="cat">Lignin Fungi</td><td>IPB ICBB Bogor</td><td>7–14d</td><td>500g</td><td>—</td><td>—</td><td>—</td><td>—</td><td className="price">$8</td><td>—</td><td>—</td><td className="note">ab2ti.org/provibio</td></tr>
          <tr><td className="num">6</td><td className="name">Pleurotus ostreatus</td><td className="cat">Lignin Fungi</td><td>Tokopedia 'bibit jamur'</td><td>1–3d ✅</td><td>100g</td><td>Thai Mushroom Co</td><td>7–14d</td><td>BM Mushroom India</td><td>7–14d</td><td className="price">$0.30</td><td>Alibaba spawn</td><td>14–21d</td><td className="note">tokopedia.com/jamur</td></tr>
          <tr><td className="num">7</td><td className="name">Trametes versicolor</td><td className="cat">Lignin Fungi</td><td>Tokopedia spawn</td><td>3–7d</td><td>500g</td><td>—</td><td>—</td><td>IndiaMART</td><td>14–21d</td><td className="price">$2</td><td>Alibaba spawn</td><td>14–21d</td><td className="note">tokopedia.com</td></tr>
          <tr><td className="num">8</td><td className="name">Trichoderma harzianum</td><td className="cat">Cellulase Fungi</td><td>Tokopedia bulk</td><td>1–3d ✅</td><td>1kg</td><td>Thai Agri Bio</td><td>7–14d</td><td>IndiaMART bulk</td><td>7–14d</td><td className="price">$1.50</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">tokopedia.com/trichoderma</td></tr>
          <tr><td className="num">9</td><td className="name">Aspergillus niger</td><td className="cat">Cellulase Fungi</td><td>Indotrading</td><td>3–7d</td><td>1kg</td><td>—</td><td>—</td><td>IndiaMART</td><td>7–14d</td><td className="price">$5</td><td>Alibaba ferment</td><td>14–21d</td><td className="note">indotrading.com</td></tr>
          <tr><td className="num">10</td><td className="name">Aspergillus oryzae (Koji)</td><td className="cat">Amylase Fungi</td><td>Tokopedia 'koji'</td><td>1–3d ✅</td><td>500g</td><td>Vietnam Bio</td><td>7–14d</td><td>—</td><td>—</td><td className="price">$3</td><td>Alibaba koji</td><td>14–21d</td><td className="note">tokopedia.com/koji</td></tr>
          <tr><td className="num">11</td><td className="name">Saccharomyces cerevisiae</td><td className="cat">Yeast</td><td>Fermipan retail</td><td>1d ✅</td><td>100g</td><td>Angel Yeast VN</td><td>3–7d</td><td>—</td><td>—</td><td className="price">$0.30</td><td>Hebei Youngdo</td><td>14–21d</td><td className="note">tokopedia.com/fermipan</td></tr>
          <tr className="wave2-row"><td className="num">12</td><td className="name">Azotobacter vinelandii</td><td className="cat">N-Fixer</td><td>PT Pupuk Kaltim Biotara</td><td>7–14d</td><td>1L</td><td>—</td><td>—</td><td>HumicFactory</td><td>7–14d</td><td className="price" style={{color: 'var(--green)'}}>$0.40 ⭐</td><td>—</td><td>—</td><td className="note">indiamart.com/humicfactory</td></tr>
          <tr className="wave2-row"><td className="num">13</td><td className="name">Azospirillum lipoferum</td><td className="cat">N-Fixer</td><td>PT Petrokimia Gresik</td><td>7–14d</td><td>1L</td><td>—</td><td>—</td><td>Jaipur Bio Fert</td><td>7–14d</td><td className="price">$1</td><td>—</td><td>—</td><td className="note">petrokimia-gresik.com</td></tr>
          <tr className="wave2-row"><td className="num">14</td><td className="name">Bradyrhizobium japonicum</td><td className="cat">N-Fixer</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>Pioneer Agro India</td><td>7–14d</td><td className="price">$1.50</td><td>—</td><td>—</td><td className="note">indiamart.com</td></tr>
          <tr><td className="num">15</td><td className="name">Lactobacillus sp. (EM-4)</td><td className="cat">LAB</td><td>EM-4 retail everywhere</td><td>1d ✅</td><td>1L</td><td>Vietnam EM</td><td>3–7d</td><td>Enzyme Bioscience</td><td>7–14d</td><td className="price">$0.86</td><td>—</td><td>—</td><td className="note">tokopedia.com/em4</td></tr>
          <tr><td className="num">16</td><td className="name">Bacillus subtilis</td><td className="cat">PGPR</td><td>Indotrading bio</td><td>3–7d</td><td>1kg</td><td>Thai Bio Co</td><td>7–14d</td><td>Ansel Biotech Vadodara</td><td>7–14d</td><td className="price" style={{color: 'var(--green)'}}>$0.20 ⭐</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">indiamart.com/ansel</td></tr>
          <tr><td className="num">17</td><td className="name">Bacillus megaterium</td><td className="cat">P-Solubiliser</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>IndiaMART bulk</td><td>7–14d</td><td className="price">$1.50</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">indiamart.com</td></tr>
          <tr><td className="num">18</td><td className="name">Pseudomonas fluorescens</td><td className="cat">P-Solubiliser</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>Katyayani Organics</td><td>7–14d</td><td className="price">$2.40</td><td>—</td><td>—</td><td className="note">indiamart.com/katyayani</td></tr>
          <tr><td className="num">19</td><td className="name">Streptomyces sp. ICBB 9155</td><td className="cat">Actinomycete</td><td>IPB ICBB Bogor</td><td>14–21d</td><td>100g</td><td>—</td><td>—</td><td>—</td><td>—</td><td className="price">$5</td><td>—</td><td>—</td><td className="note">ab2ti.org</td></tr>
          <tr><td className="num">20</td><td className="name">Streptomyces sp. ICBB 9469</td><td className="cat">Actinomycete</td><td>IPB Bogor</td><td>14–21d</td><td>100g</td><td>—</td><td>—</td><td>—</td><td>—</td><td className="price">$5</td><td>—</td><td>—</td><td className="note">ab2ti.org</td></tr>
          <tr><td className="num">21</td><td className="name">Bacillus mucilaginosus</td><td className="cat">K-Mobiliser</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>IndiaMART</td><td>7–14d</td><td className="price">$3</td><td>Alibaba</td><td>14–21d</td><td className="note">indiamart.com</td></tr>
          <tr><td className="num">22</td><td className="name">Frateuria aurantia</td><td className="cat">K-Mobiliser</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>IARI India</td><td>14–21d</td><td className="price">$4</td><td>—</td><td>—</td><td className="note">iari.res.in</td></tr>
          <tr className="warning-row"><td className="num" style={{color: 'var(--red)'}}>23</td><td className="name" style={{color: 'var(--red)'}}>Bt ICBB 6095</td><td><span className="pill pill-red" style={{fontSize: '10px'}}>Excluded/Conditional</span></td><td style={{color: 'var(--red)'}}>DO NOT SOURCE</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td className="note" style={{color: 'var(--red)'}}>Toxic to BSF Diptera</td></tr>
          <tr><td className="num">24</td><td className="name">Cellulase (T. reesei)</td><td className="cat">Enzyme</td><td>Novozymes Indonesia</td><td>7–14d</td><td>25kg</td><td>DSM Singapore</td><td>7–14d</td><td>Alibaba India</td><td>14–21d</td><td className="price">$15</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">novozymes.com</td></tr>
          <tr><td className="num">25</td><td className="name">Xylanase</td><td className="cat">Enzyme</td><td>PT Enzymes Indo</td><td>7–14d</td><td>25kg</td><td>DSM Singapore</td><td>7–14d</td><td>Alibaba India</td><td>14–21d</td><td className="price">$17</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">alibaba.com</td></tr>
          <tr><td className="num">26</td><td className="name">Laccase</td><td className="cat">Enzyme</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>Alibaba India</td><td>14–21d</td><td className="price">$20</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">alibaba.com</td></tr>
          <tr><td className="num">27</td><td className="name">Pectinase</td><td className="cat">Enzyme</td><td>—</td><td>—</td><td>—</td><td>DSM Singapore</td><td>7–14d</td><td>Alibaba India</td><td>14–21d</td><td className="price">$12</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">alibaba.com</td></tr>
          <tr><td className="num">28</td><td className="name">Lipase</td><td className="cat">Enzyme</td><td>Novozymes Indonesia</td><td>7–14d</td><td>25kg</td><td>—</td><td>—</td><td>Novozymes India</td><td>14–21d</td><td className="price">$18</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">novozymes.com</td></tr>
          <tr><td className="num">29</td><td className="name">Protease</td><td className="cat">Enzyme</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>Alibaba India</td><td>14–21d</td><td className="price">$10</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">alibaba.com</td></tr>
          <tr><td className="num">30</td><td className="name">Amylase</td><td className="cat">Enzyme</td><td>Indotrading</td><td>3–7d</td><td>25kg</td><td>—</td><td>—</td><td>Alibaba India</td><td>14–21d</td><td className="price">$8</td><td>Alibaba bulk</td><td>14–21d</td><td className="note">alibaba.com</td></tr>
          <tr style={{background: 'rgba(0,50,30,.4)'}}><td className="num" style={{color: 'var(--teal)'}}>31</td><td className="name" style={{color: 'var(--teal)'}}>Rhizopus oligosporus</td><td className="cat">Protein Fungi</td><td>Tokopedia 'ragi tempe'</td><td>1–3d ✅</td><td>100g</td><td>Vietnam tempeh starter</td><td>3–7d</td><td>IndiaMART tempeh culture</td><td>7–14d</td><td className="price">$0.50</td><td>Alibaba spore powder</td><td>14–21d</td><td className="note">tokopedia.com/ragi-tempe</td></tr>
          <tr className="algae-row"><td className="num" style={{color: 'var(--green)'}}>32</td><td className="name" style={{color: 'var(--green)'}}>Arthrospira platensis (Spirulina)</td><td className="cat" style={{color: 'var(--green)'}}>Algae-B</td><td>CFI on-site POME raceway</td><td>N/A CapEx</td><td>N/A</td><td>PT Sari Segar Nusantara</td><td>14–30d</td><td>Parry Nutraceuticals</td><td>21–30d</td><td className="price">$0 (CapEx)</td><td>Hainan Simai China</td><td>21–30d</td><td className="note">On-site raceway</td></tr>
          <tr className="algae-row"><td className="num" style={{color: 'var(--pastelGreen)'}}>33</td><td className="name" style={{color: 'var(--pastelGreen)'}}>Chlorella vulgaris</td><td className="cat" style={{color: 'var(--green)'}}>Algae-B</td><td>CFI on-site POME raceway</td><td>N/A CapEx</td><td>N/A</td><td>PT Bio Niaga Nusantara</td><td>14–21d</td><td>Roquette India</td><td>21–30d</td><td className="price">$0 (CapEx)</td><td>Algal Scientific China</td><td>21–30d</td><td className="note">On-site raceway</td></tr>
        </tbody>
      </table>
    </div>
  </div>

{/* ══════════════ TAB: REFERENCES ══════════════ */}
          </div>
        </div>

        {/* TAB: DOSAGE CALCULATOR */}
        <div className={`tab-panel ${activeTab === 'dosage' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title teal">Section B: Dosage Calculator — 20 Key Organisms + Enzymes</span>
              <span className="badge badge-amber">Calculated</span>
            </div>
            <div className="metrics">
              <div className="metric">
                <div className="metric-label">Batch Size</div>
                <div className="metric-value">1,000</div>
                <div className="metric-unit">t FW / batch</div>
              </div>
              <div className="metric">
                <div className="metric-label">DM Content</div>
                <div className="metric-value teal">35%</div>
                <div className="metric-unit">CFI: 62–65% MC</div>
              </div>
              <div className="metric">
                <div className="metric-label">DM Per Batch</div>
                <div className="metric-value">350</div>
                <div className="metric-unit">t DM</div>
              </div>
              <div className="metric">
                <div className="metric-label">Monthly Throughput</div>
                <div className="metric-value amber">8,157</div>
                <div className="metric-unit">t FW / month (S1 Locked)</div>
              </div>
              <div className="metric">
                <div className="metric-label">Monthly DM</div>
                <div className="metric-value">2,854.95</div>
                <div className="metric-unit">t DM / month</div>
              </div>
            </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title teal">Section B: Dosage Calculator — 20 Key Organisms + Enzymes</span>
      <span className="badge badge-amber">Calculated</span>
    </div>
    <div className="metrics">
      <div className="metric"><div className="metric-label">Batch Size</div><div className="metric-value">1,000</div><div className="metric-unit">t FW / batch</div></div>
      <div className="metric"><div className="metric-label">DM Content</div><div className="metric-value teal">35%</div><div className="metric-unit">CFI: 62–65% MC</div></div>
      <div className="metric"><div className="metric-label">DM Per Batch</div><div className="metric-value">350</div><div className="metric-unit">t DM</div></div>
      <div className="metric"><div className="metric-label">Monthly Throughput</div><div className="metric-value amber">8,157</div><div className="metric-unit">t FW / month (S1 Locked)</div></div>
      <div className="metric"><div className="metric-label">Monthly DM</div><div className="metric-value">2,854.95</div><div className="metric-unit">t DM / month</div></div>
    </div>
    <div className="tbl-wrap">
      <table>
        <thead><tr>
          <th>#</th><th className="left">Organism / Enzyme</th><th>Form</th><th>Unit</th><th>$/Unit</th>
          <th>Dose Low % DM</th><th>Dose High % DM</th><th>kg/t FW Low</th><th>kg/t FW High</th>
          <th>Cost Low $/t FW</th><th>Cost High $/t FW</th><th>Monthly kg Low</th><th>Monthly Cost Low $</th><th>Quote</th>
        </tr></thead>
        <tbody>
          <tr><td className="num">1</td><td className="name">Thermomyces lanuginosus</td><td>Dry</td><td>kg</td><td className="price">$25</td><td>0.05</td><td>0.15</td><td>0.0175</td><td>0.0525</td><td className="num">0.4375</td><td className="num">1.3125</td><td>142.7</td><td className="num">$3,569</td><td>Alibaba</td></tr>
          <tr><td className="num">2</td><td className="name">Geobacillus stearothermophilus</td><td>Dry</td><td>kg</td><td className="price">$15</td><td>0.05</td><td>0.15</td><td>0.0175</td><td>0.0525</td><td className="num">0.2625</td><td className="num">0.7875</td><td>142.7</td><td className="num">$2,141</td><td>IndiaMART</td></tr>
          <tr><td className="num">3</td><td className="name">Bacillus licheniformis</td><td>Dry</td><td>kg</td><td className="price">$8</td><td>0.05</td><td>0.20</td><td>0.0175</td><td>0.0700</td><td className="num">0.1400</td><td className="num">0.5600</td><td>142.7</td><td className="num">$1,142</td><td>Alibaba</td></tr>
          <tr><td className="num">4</td><td className="name">Phanerochaete sp. ICBB 9182</td><td>Wet</td><td>L</td><td className="price">$8</td><td>0.05</td><td>0.15</td><td>0.0175</td><td>0.0525</td><td className="num">0.1400</td><td className="num">0.4200</td><td>142.7</td><td className="num">$1,142</td><td>IPB ICBB</td></tr>
          <tr><td className="num">5</td><td className="name">Pleurotus ostreatus</td><td>Wet</td><td>kg</td><td className="price">$0.30</td><td>0.05</td><td>0.15</td><td>0.0175</td><td>0.0525</td><td className="num">0.0053</td><td className="num">0.0158</td><td>142.7</td><td className="num">$43</td><td>Tokopedia</td></tr>
          <tr><td className="num">6</td><td className="name">Trichoderma harzianum</td><td>Dry</td><td>kg</td><td className="price">$1.50</td><td>0.05</td><td>0.15</td><td>0.0175</td><td>0.0525</td><td className="num">0.0263</td><td className="num">0.0788</td><td>142.7</td><td className="num">$214</td><td>Tokopedia</td></tr>
          <tr><td className="num">7</td><td className="name">Saccharomyces cerevisiae</td><td>Dry</td><td>kg</td><td className="price">$0.30</td><td>0.05</td><td>0.20</td><td>0.0175</td><td>0.0700</td><td className="num">0.0053</td><td className="num">0.0210</td><td>142.7</td><td className="num">$43</td><td>Fermipan</td></tr>
          <tr className="wave2-row"><td className="num">8</td><td className="name">Azotobacter vinelandii</td><td>Wet</td><td>L</td><td className="price">$0.40</td><td>0.05</td><td>0.20</td><td>0.0175</td><td>0.0700</td><td className="num">0.0070</td><td className="num">0.0280</td><td>142.7</td><td className="num">$57</td><td>HumicFactory</td></tr>
          <tr className="wave2-row"><td className="num">9</td><td className="name">Azospirillum lipoferum</td><td>Wet</td><td>L</td><td className="price">$1</td><td>0.05</td><td>0.10</td><td>0.0175</td><td>0.0350</td><td className="num">0.0175</td><td className="num">0.0350</td><td>142.7</td><td className="num">$143</td><td>Jaipur Bio</td></tr>
          <tr><td className="num">10</td><td className="name">Lactobacillus sp. (EM-4)</td><td>Wet</td><td>L</td><td className="price">$0.17</td><td>0.05</td><td>0.15</td><td>0.0175</td><td>0.0525</td><td className="num">0.0030</td><td className="num">0.0089</td><td>142.7</td><td className="num">$24</td><td>EM-4 retail</td></tr>
          <tr><td className="num">11</td><td className="name">Bacillus subtilis</td><td>Dry</td><td>kg</td><td className="price">$0.20</td><td>0.03</td><td>0.05</td><td>0.0105</td><td>0.0175</td><td className="num">0.0021</td><td className="num">0.0035</td><td>85.6</td><td className="num">$17</td><td>Ansel Biotech</td></tr>
          <tr><td className="num">12</td><td className="name">Bacillus megaterium</td><td>Dry</td><td>kg</td><td className="price">$1.50</td><td>0.03</td><td>0.05</td><td>0.0105</td><td>0.0175</td><td className="num">0.0158</td><td className="num">0.0263</td><td>85.6</td><td className="num">$128</td><td>IndiaMART</td></tr>
          <tr><td className="num">13</td><td className="name">Pseudomonas fluorescens</td><td>Wet</td><td>L</td><td className="price">$2.40</td><td>0.05</td><td>0.10</td><td>0.0175</td><td>0.0350</td><td className="num">0.0420</td><td className="num">0.0840</td><td>142.7</td><td className="num">$343</td><td>Katyayani</td></tr>
          <tr><td className="num">14</td><td className="name">Streptomyces sp. ICBB 9155</td><td>Dry</td><td>kg</td><td className="price">$5</td><td>0.02</td><td>0.05</td><td>0.0070</td><td>0.0175</td><td className="num">0.0350</td><td className="num">0.0875</td><td>57.1</td><td className="num">$285</td><td>IPB ICBB</td></tr>
          <tr data-cat="enzyme"><td className="num">15</td><td className="name">Cellulase (T. reesei)</td><td>Dry</td><td>kg</td><td className="price">$15</td><td>0.01</td><td>0.05</td><td>0.0035</td><td>0.0175</td><td className="num">0.0525</td><td className="num">0.2625</td><td>28.5</td><td className="num">$428</td><td>Novozymes</td></tr>
          <tr data-cat="enzyme"><td className="num">16</td><td className="name">Xylanase</td><td>Dry</td><td>kg</td><td className="price">$17</td><td>0.01</td><td>0.05</td><td>0.0035</td><td>0.0175</td><td className="num">0.0595</td><td className="num">0.2975</td><td>28.5</td><td className="num">$485</td><td>Alibaba</td></tr>
          <tr data-cat="enzyme"><td className="num">17</td><td className="name">Laccase</td><td>Dry</td><td>kg</td><td className="price">$20</td><td>0.01</td><td>0.03</td><td>0.0035</td><td>0.0105</td><td className="num">0.0700</td><td className="num">0.2100</td><td>28.5</td><td className="num">$571</td><td>Alibaba</td></tr>
          <tr data-cat="enzyme"><td className="num">18</td><td className="name">Pectinase</td><td>Dry</td><td>kg</td><td className="price">$12</td><td>0.005</td><td>0.02</td><td>0.00175</td><td>0.0070</td><td className="num">0.0210</td><td className="num">0.0840</td><td>14.3</td><td className="num">$171</td><td>Alibaba</td></tr>
          <tr data-cat="enzyme"><td className="num">19</td><td className="name">Lipase</td><td>Dry</td><td>kg</td><td className="price">$18</td><td>0.005</td><td>0.02</td><td>0.00175</td><td>0.0070</td><td className="num">0.0315</td><td className="num">0.1260</td><td>14.3</td><td className="num">$257</td><td>Novozymes</td></tr>
          <tr data-cat="enzyme"><td className="num">20</td><td className="name">Protease</td><td>Dry</td><td>kg</td><td className="price">$10</td><td>0.005</td><td>0.02</td><td>0.00175</td><td>0.0070</td><td className="num">0.0175</td><td className="num">0.0700</td><td>14.3</td><td className="num">$143</td><td>Alibaba</td></tr>
          <tr className="total-row"><td colspan="9" style={{textAlign: 'right', color: 'var(--pastelGreen)', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '700', padding: '8px 14px'}}>Total (20-item stack)</td><td className="num" style={{color: 'var(--pastelGreen)'}}>$1.39</td><td className="num" style={{color: 'var(--pastelGreen)'}}>$4.52</td><td colspan="2" className="num" style={{color: 'var(--pastelGreen)'}}>$11,347 / month</td><td></td></tr>
        </tbody>
      </table>
    </div>
  </div>
        </div>

        {/* TAB: CONSORTIUM GROUPS */}
        <div className={`tab-panel ${activeTab === 'consortium' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title green">Section C: Consortium Groups & Stacking Rules</span>
              <span className="badge badge-green">9-Organism Reference</span>
            </div>
          </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title teal">Section C: Consortium Groups — 18 Pre-Built Stacks</span>
      <span className="badge badge-green">Calculated Output</span>
    </div>
    <div className="alert alert-amber"><strong>Wave Rule:</strong> Wave 1 (Day 0, 50–70°C) = Thermophilic specialists. Wave 2 (Day 5+, &lt;50°C) = Temperature-sensitive N-fixers. In the 9-org stack: Wave 1A (Day 0) then Wave 1B (Day 3+) after Rhizopus mycelium confirmed.</div>
    <div className="consortium-grid">
      <div className="c-card"><div className="c-card-name">Thermophilic Start</div><div className="c-card-orgs">Thermomyces + Geobacillus + B. licheniformis</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$4.50–$13.00/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Uplift</div><div className="c-mini-val green">+20–30%</div></div><div className="c-mini"><div className="c-mini-label">Ready</div><div className="c-mini-val teal">Day 0–7</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Hot Cellulase</div><div className="c-card-orgs">Cellulase + Xylanase + Thermomyces</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$5.00–$15.00/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Uplift</div><div className="c-mini-val green">+35–50%</div></div><div className="c-mini"><div className="c-mini-label">Ready</div><div className="c-mini-val teal">Day 0–7</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Biggest BSF</div><div className="c-card-orgs">Pleurotus + Azotobacter (Day 5+)</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$0.35–$0.90/t</div></div><div className="c-mini"><div className="c-mini-label">Larvae</div><div className="c-mini-val green">220–240 kg/t</div></div><div className="c-mini"><div className="c-mini-label">Ready</div><div className="c-mini-val teal">Day 0–28</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Shortest Time</div><div className="c-card-orgs">Cellulase + Lactobacillus EM-4</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$1.75–$8.00/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Uplift</div><div className="c-mini-val green">+28–38%</div></div><div className="c-mini"><div className="c-mini-label">Ready</div><div className="c-mini-val teal">Day 0–21</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Least Cost</div><div className="c-card-orgs">Pleurotus + Lactobacillus + S. cerevisiae</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$0.32–$0.92/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Uplift</div><div className="c-mini-val green">+25–35%</div></div><div className="c-mini"><div className="c-mini-label">Use</div><div className="c-mini-val teal">Budget Pilots</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Max Nutrients</div><div className="c-card-orgs">Azotobacter + B. megaterium + Pseudomonas</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$2.00–$3.30/t</div></div><div className="c-mini"><div className="c-mini-label">NPK</div><div className="c-mini-val green">+35–45%</div></div><div className="c-mini"><div className="c-mini-label">Ready</div><div className="c-mini-val teal">Day 7–35</div></div></div></div>
      <div className="c-card"><div className="c-card-name">The Big 3</div><div className="c-card-orgs">Phanerochaete + Azotobacter + Trichoderma</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$4.95–$10.10/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Uplift</div><div className="c-mini-val green">+50–70%</div></div><div className="c-mini"><div className="c-mini-label">Lignin</div><div className="c-mini-val teal">−10–15% DM</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Full Fibre + N</div><div className="c-card-orgs">Phanerochaete + Azotobacter + Paenibacillus + Microbacterium</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$6.00–$13.60/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Uplift</div><div className="c-mini-val green">+60–80%</div></div><div className="c-mini"><div className="c-mini-label">N Result</div><div className="c-mini-val teal">+0.5–0.7%</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Budget Powerhouse</div><div className="c-card-orgs">Pleurotus + Azotobacter + Saccharomyces</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$0.35–$1.35/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Uplift</div><div className="c-mini-val green">+35–50%</div></div><div className="c-mini"><div className="c-mini-label">Use</div><div className="c-mini-val teal">Proof Of Concept</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Provibio 9-Org</div><div className="c-card-orgs">All 9 ICBB strains (excl. Bt for BSF)</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$7.00/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Uplift</div><div className="c-mini-val green">+50–65%</div></div><div className="c-mini"><div className="c-mini-label">Lignin</div><div className="c-mini-val teal">−15–18% DM</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Enzyme Cocktail</div><div className="c-card-orgs">Cellulase + Xylanase + Pectinase + Laccase</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$4.00–$12.00/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Uplift</div><div className="c-mini-val green">+50–72%</div></div><div className="c-mini"><div className="c-mini-label">Ready</div><div className="c-mini-val teal">Day 0–7</div></div></div></div>
      {/* NEW MAR 2026 */}
      <div className="c-card" style={{borderColor: 'var(--teal)'}}><div className="c-card-name" style={{color: 'var(--green)'}}>9-Org One-Shot</div><div className="c-card-orgs">Wave 1A: Lactobacillus + Saccharomyces + B. subtilis + B. licheniformis + B. coagulans + Rhizopus + Aspergillus<br />Wave 1B Day 3+: Azotobacter + Trichoderma</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$3.56–$4.50/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Meal CP</div><div className="c-mini-val green">+45–55%</div></div><div className="c-mini"><div className="c-mini-label">Ready</div><div className="c-mini-val teal">Day 0–28</div></div></div></div>
      <div className="c-card" style={{borderColor: 'var(--green)'}}><div className="c-card-name" style={{color: 'var(--green)'}}>9-Org + Spirulina</div><div className="c-card-orgs">All 9 organisms + Arthrospira platensis via 1,850 L POME hydration. 2.31 kg DM algae/t EFB DM. +22% neonate survival</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$3.56/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Meal CP</div><div className="c-mini-val green">52–56%</div></div><div className="c-mini"><div className="c-mini-label">Market</div><div className="c-mini-val teal">$4,500–6,500/t</div></div></div></div>
      <div className="c-card" style={{borderColor: 'var(--pastelGreen)'}}><div className="c-card-name" style={{color: 'var(--pastelGreen)'}}>9-Org + Chlorella</div><div className="c-card-orgs">All 9 organisms + Chlorella vulgaris via 1,850 L POME hydration. 2.03 kg DM algae/t EFB DM. +15% neonate survival</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$3.56/t</div></div><div className="c-mini"><div className="c-mini-label">BSF Meal CP</div><div className="c-mini-val green">50–51%</div></div><div className="c-mini"><div className="c-mini-label">Market</div><div className="c-mini-val teal">$3,500–4,500/t</div></div></div></div>
      <div className="c-card"><div className="c-card-name">Rhizopus Protein-First</div><div className="c-card-orgs">Rhizopus + Aspergillus niger + Lactobacillus. Fast 48–72h action. No Trichoderma (protects Rhizopus)</div><div className="c-card-metrics"><div className="c-mini"><div className="c-mini-label">Cost</div><div className="c-mini-val amber">$0.15–$0.40/t</div></div><div className="c-mini"><div className="c-mini-label">CP Uplift</div><div className="c-mini-val green">+12–18%</div></div><div className="c-mini"><div className="c-mini-label">Ready</div><div className="c-mini-val teal">Day 0–5</div></div></div></div>
    </div>
  </div>

        {/* TAB: INOCULATION TIMELINE */}
        <div className={`tab-panel ${activeTab === 'timeline' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title amber">Section D: Inoculation Timeline — Day 0 to Day 21+</span>
              <span className="badge badge-amber">Process Map</span>
            </div>
          </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title amber">Section D: Inoculation Timeline — Two-Wave + Three-Wave Strategy</span>
      <span className="badge badge-amber">Calculated</span>
    </div>
    <div className="alert alert-amber"><strong>Critical Timing:</strong> Trichoderma harzianum MUST be added Wave 1B (Day 3+) ONLY in 9-org stack — never simultaneously with Rhizopus oligosporus. Azotobacter DIES above 50°C — confirm substrate &lt;50°C before Wave 2. N-fixers are ineffective at pH &lt;5.5.</div>
    <div className="timeline">
      <div className="tl-row hdr">
        <div style={{fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '700', color: 'var(--grey)'}}>Day / Phase</div>
        <div style={{fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '700', color: 'var(--grey)'}}>Temp °C</div>
        <div style={{fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '700', color: 'var(--grey)'}}>Wave</div>
        <div style={{fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '700', color: 'var(--grey)'}}>Organisms / Enzymes / Action</div>
      </div>
      {/* STANDARD */}
      <div className="tl-row wave1">
        <div className="tl-label">Day 0 (End of S2)</div>
        <div className="tl-temp">28–35°C → warming</div>
        <div><span className="tl-wave w1">Wave 1</span></div>
        <div className="tl-body">Apply: <strong>Thermomyces lanuginosus, Geobacillus stearothermophilus, Bacillus licheniformis, Trichoderma sp., Pleurotus ostreatus</strong><br />Enzymes: Cellulase 0.01–0.05% DM · Xylanase 0.01–0.05% DM · Pectinase 0.005–0.02% DM<br />Dose: 0.05–0.20% DM per organism | Cost: $4–15/t FW | Go Gate: Moisture 55–65%, fresh substrate</div>
      </div>
      <div className="tl-row">
        <div className="tl-label">Day 1–3 Thermo Rise</div>
        <div className="tl-temp">40–60°C rising</div>
        <div><span className="pill pill-grey" style={{fontSize: '10px'}}>No New</span></div>
        <div className="tl-body">Day 0 organisms active. Thermophiles dominant. Enzyme activity peaks.<br />GO: Temp rising = good, mycelium visible. FAIL: Sour smell = anaerobic → TURN immediately.</div>
      </div>
      <div className="tl-row">
        <div className="tl-label">Day 3–7 Thermo Peak</div>
        <div className="tl-temp">50–70°C peak</div>
        <div><span className="pill pill-grey" style={{fontSize: '10px'}}>Optional</span></div>
        <div className="tl-body">Optional booster: More Thermomyces, more B. licheniformis, Laccase 0.01–0.03% DM<br />GO: Peak 55–65°C, ADL dropping. FAIL: No softening → reinoculate.</div>
      </div>
      <div className="tl-row">
        <div className="tl-label">Day 5 Cooling Start</div>
        <div className="tl-temp">&lt;55°C declining</div>
        <div><span className="pill pill-amber" style={{fontSize: '10px'}}>Prepare W2</span></div>
        <div className="tl-body"><strong>Measure temperature.</strong> If &lt;50°C → proceed to Wave 2. If &gt;50°C → wait 12h. No new enzymes.</div>
      </div>
      <div className="tl-row wave2">
        <div className="tl-label">Day 5–7 Wave 2</div>
        <div className="tl-temp" style={{color: 'var(--blue)'}}>&lt;50°C CRITICAL</div>
        <div><span className="tl-wave w2">Wave 2</span></div>
        <div className="tl-body">Apply: <strong>Azotobacter vinelandii ICBB 9098, Azospirillum lipoferum ICBB 6088, Bradyrhizobium japonicum ICBB 9251, Lactobacillus sp. EM-4, Saccharomyces cerevisiae</strong><br />Dose: 0.05–0.20% per organism | Cost: $1–3/t | GO: Temp &lt;50°C, pH 6.5–7.5 | FAIL: Temp &gt;50°C = N-fixers DIE</div>
      </div>
      <div className="tl-row">
        <div className="tl-label">Day 7–14 Mesophilic</div>
        <div className="tl-temp">40–50°C stable</div>
        <div><span className="pill pill-grey" style={{fontSize: '10px'}}>No New</span></div>
        <div className="tl-body">N-fixers colonising. NH₃ buffered to 6.8–7.2. Earthy smell, ADL −20–30%. FAIL: pH &lt;6.0 → add lime.</div>
      </div>
      <div className="tl-row">
        <div className="tl-label">Day 14–21 Maturation</div>
        <div className="tl-temp">35–42°C cooling</div>
        <div><span className="pill pill-grey" style={{fontSize: '10px'}}>Optional</span></div>
        <div className="tl-body">Optional: B. megaterium (P-sol) + Pseudomonas fluorescens | 0.03–0.05% DM | $1–2/t | GO: pH 6.5–7.5, C:N 15–25:1</div>
      </div>
      <div className="tl-row handoff">
        <div className="tl-label">Day 21+ BSF Ready</div>
        <div className="tl-temp">&lt;40°C</div>
        <div><span className="tl-wave hnd">Handoff</span></div>
        <div className="tl-body">Final P-sol dose + Streptomyces sp. (pathogen control) | 0.02–0.05% DM | $1–2/t<br /><strong>ALL 6 BSF HANDOFF GATE CRITERIA MUST PASS before transfer to S4.</strong></div>
      </div>
      {/* 9-ORG 3-WAVE */}
      <div style={{margin: '20px 0 8px', padding: '6px 0', borderTop: '1.5px solid var(--border)'}}>
        <div style={{fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '13px', color: 'var(--teal)'}}>Updated 3-Wave Strategy — 9-Org + Rhizopus Stack (Mar 2026)</div>
      </div>
      <div className="tl-row algae">
        <div className="tl-label">Pre-Stage B Hydration</div>
        <div className="tl-temp">28–35°C ambient</div>
        <div><span className="tl-wave alg">Stream B</span></div>
        <div className="tl-body">Replace hydration water with <strong>Spirulina or Chlorella POME slurry</strong>. 1,850 L per tonne DM EFB. Delivers 2.03–2.31 kg DM algae protein. GO: OD600 &gt; 0.5. No raceway? Use clean water (standard protocol).</div>
      </div>
      <div className="tl-row wave1">
        <div className="tl-label">Day 0 Wave 1A (9-org)</div>
        <div className="tl-temp">28–35°C → warming</div>
        <div><span className="tl-wave w1">Wave 1A</span></div>
        <div className="tl-body">1. Lactobacillus sp. EM-4 ICBB 6099 &nbsp;2. Saccharomyces cerevisiae ICBB 8808 &nbsp;3. Bacillus subtilis ICBB 8780<br />4. Bacillus licheniformis &nbsp;5. Bacillus coagulans &nbsp;<strong>6. Rhizopus oligosporus &nbsp;7. Aspergillus niger</strong><br /><span style={{color: 'var(--red)', fontWeight: '700'}}>⚠ DO NOT add Trichoderma yet — will kill Rhizopus</span><br />Enzymes: Cellulase + Xylanase + Pectinase 0.01–0.05% DM | Cost: $2–5/t</div>
      </div>
      <div className="tl-row">
        <div className="tl-label">Day 1–3 Fungal Establishment</div>
        <div className="tl-temp">40–60°C rising</div>
        <div><span className="pill pill-grey" style={{fontSize: '10px'}}>No New</span></div>
        <div className="tl-body">Rhizopus + Aspergillus establishing mycelium. Lactobacillus buffering pH 5.5–6.5. Saccharomyces trapping NH4+.<br /><strong>Wait minimum 48h before Wave 1B.</strong> GO: White mycelium fuzz visible. FAIL: No fuzz 48h → re-inoculate Rhizopus.</div>
      </div>
      <div className="tl-row wave1b">
        <div className="tl-label">Day 3 Wave 1B (9-org)</div>
        <div className="tl-temp" style={{color: 'var(--teal)'}}>&lt;55°C declining</div>
        <div><span className="tl-wave w1b">Wave 1B</span></div>
        <div className="tl-body"><strong>8. Azotobacter vinelandii ICBB 9098 &nbsp;&nbsp;9. Trichoderma harzianum ICBB 9127</strong><br /><span style={{color: 'var(--red)', fontWeight: '700'}}>CRITICAL: Rhizopus white fuzz MUST be visible before adding Trichoderma. Trichoderma is a mycoparasite.</span><br />Temp check: Azotobacter dies &gt;50°C — confirm &lt;50°C before spraying. Dose: 0.05–0.15% per organism | Cost: $0.95–$2.10/t</div>
      </div>
      <div className="tl-row handoff">
        <div className="tl-label">Day 14–21+ Handoff</div>
        <div className="tl-temp">35–42°C cooling</div>
        <div><span className="tl-wave hnd">Handoff</span></div>
        <div className="tl-body">Optional Day 14: B. megaterium + Pseudomonas fluorescens. Day 21: Streptomyces sp. (pathogen control).<br /><strong>All 6 BSF Handoff Gate criteria must pass before transfer to S4. C:N 15–25:1 required.</strong></div>
      </div>
    </div>
  </div>

        {/* TAB: BSF HANDOFF GATE */}
        <div className={`tab-panel ${activeTab === 'handoff' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title red">Section E: BSF Handoff Gate — S3→S4 Transition</span>
              <span className="badge badge-red">Hard Gate</span>
            </div>
          </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title red">Section E: BSF Handoff Gate — 6-Criteria Pass/Fail</span>
      <span className="badge badge-red">Action Needed</span>
    </div>
    <div className="alert alert-red"><strong>ALL 6 CRITERIA MUST PASS (GREEN) BEFORE SUBSTRATE TRANSFER TO BSF REARING FACILITY.</strong> Any single FAIL = hold, remediate, recheck. Do not transfer partial passes.</div>
    <div className="tbl-wrap">
      <table>
        <thead><tr>
          <th>#</th><th className="left">Criterion</th><th>Target Range</th><th>Measured (Input)</th>
          <th>Pass / Fail</th><th>Method</th><th className="left">Action If Fail</th><th className="left">Bio Used</th><th>Dose % DM</th>
        </tr></thead>
        <tbody>
          <tr><td className="num">1</td><td className="name">C:N Ratio</td><td className="num">15:1 to 25:1</td><td><input type="text" style={{background: 'var(--navyDk)', border: '1.5px solid var(--border)', borderRadius: '4px', padding: '3px 8px', color: 'var(--amber)', fontFamily: "'DM Mono', monospace", fontSize: '11px', width: '70px'}} placeholder="Enter" /></td><td><span className="pill pill-grey">Pending</span></td><td>Lab Analysis</td><td className="fn">Add N source or extend conditioning</td><td className="fn">Azotobacter / Azospirillum</td><td>0.05–0.20</td></tr>
          <tr><td className="num">2</td><td className="name">Moisture %</td><td className="num">60% to 70%</td><td><input type="text" style={{background: 'var(--navyDk)', border: '1.5px solid var(--border)', borderRadius: '4px', padding: '3px 8px', color: 'var(--amber)', fontFamily: "'DM Mono', monospace", fontSize: '11px', width: '70px'}} placeholder="Enter" /></td><td><span className="pill pill-grey">Pending</span></td><td>Gravimetric</td><td className="fn">Add water (low) or drain (high)</td><td>—</td><td>—</td></tr>
          <tr><td className="num">3</td><td className="name">pH</td><td className="num">6.5 to 7.5</td><td><input type="text" style={{background: 'var(--navyDk)', border: '1.5px solid var(--border)', borderRadius: '4px', padding: '3px 8px', color: 'var(--amber)', fontFamily: "'DM Mono', monospace", fontSize: '11px', width: '70px'}} placeholder="Enter" /></td><td><span className="pill pill-grey">Pending</span></td><td>pH Meter</td><td className="fn">Lime (low pH) or sulfur (high pH)</td><td className="fn">Lactobacillus EM-4</td><td>0.05–0.15</td></tr>
          <tr><td className="num">4</td><td className="name">Temperature</td><td className="num">&lt; 40°C</td><td><input type="text" style={{background: 'var(--navyDk)', border: '1.5px solid var(--border)', borderRadius: '4px', padding: '3px 8px', color: 'var(--amber)', fontFamily: "'DM Mono', monospace", fontSize: '11px', width: '70px'}} placeholder="Enter" /></td><td><span className="pill pill-grey">Pending</span></td><td>Probe</td><td className="fn">Wait or aerate pile</td><td>—</td><td>—</td></tr>
          <tr className="warning-row"><td className="num" style={{color: 'var(--red)'}}>5</td><td className="name" style={{color: 'var(--red)'}}>Bt ICBB 6095</td><td style={{color: 'var(--red)', fontFamily: "'DM Mono', monospace", fontSize: '11px'}}>NOT PRESENT</td><td><input type="text" style={{background: 'var(--navyDk)', border: '1.5px solid var(--red)', borderRadius: '4px', padding: '3px 8px', color: 'var(--red)', fontFamily: "'DM Mono', monospace", fontSize: '11px', width: '70px'}} placeholder="Titre" /></td><td><span className="pill pill-red">Critical</span></td><td>Batch Record</td><td className="fn" style={{color: 'var(--red)'}}>Titre must be &lt;10⁴ CFU/g. COMPOST PHASE ONLY. Cry proteins toxic to BSF Diptera</td><td><span className="pill pill-red">Conditional</span></td><td>—</td></tr>
          <tr><td className="num">6</td><td className="name">Visual Texture</td><td>Dark, crumbly, no EFB fibre</td><td><input type="text" style={{background: 'var(--navyDk)', border: '1.5px solid var(--border)', borderRadius: '4px', padding: '3px 8px', color: 'var(--amber)', fontFamily: "'DM Mono', monospace", fontSize: '11px', width: '70px'}} placeholder="Pass/Fail" /></td><td><span className="pill pill-grey">Pending</span></td><td>Visual</td><td className="fn">Extend composting time</td><td className="fn">White-rot fungi</td><td>0.05–0.15</td></tr>
          <tr className="total-row"><td colspan="4" style={{textAlign: 'right', padding: '8px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '700', color: 'var(--pastelGreen)'}}>Overall BSF Handoff Decision</td><td colspan="5" style={{padding: '8px 14px', fontFamily: "'Syne', sans-serif", fontSize: '13px', fontWeight: '700', color: 'var(--red)'}}>All 6 Pass? → Transfer To S4 &nbsp;&nbsp; Any Fail? → DO NOT TRANSFER</td></tr>
        </tbody>
      </table>
    </div>
  </div>

        {/* TAB: ALGAE HYDRATOR */}
        <div className={`tab-panel ${activeTab === 'algae' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title green">Section G: Algae Hydrator — Stream B (POME)</span>
              <span className="badge badge-green">Spirulina Primary</span>
            </div>
          </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title green">Section F: Stream B — Algae Hydrator</span>
      <span className="badge badge-green">Calculated Output</span>
    </div>
    <div className="alert alert-green"><strong>$0 Ongoing OpEx.</strong> Arthrospira platensis grown in POME raceways using free tropical sunlight. Replaces hydration water in S3 substrate prep. CapEx ~$32,400. Payback &lt; 6 months at $3,500/t BSF meal premium.</div>
    <div className="metrics">
      <div className="metric"><div className="metric-label">Spirulina Yield</div><div className="metric-value green">1.25 g/L</div><div className="metric-unit">DM per L POME</div></div>
      <div className="metric"><div className="metric-label">Algae Per Tonne EFB DM</div><div className="metric-value">2.31 kg</div><div className="metric-unit">via 1,850 L hydration</div></div>
      <div className="metric"><div className="metric-label">Spirulina CP</div><div className="metric-value amber">65%</div><div className="metric-unit">DM basis</div></div>
      <div className="metric"><div className="metric-label">BSF Neonate Survival</div><div className="metric-value green">+22%</div><div className="metric-unit">vs no algae</div></div>
      <div className="metric"><div className="metric-label">Final BSF Meal CP</div><div className="metric-value amber">56%</div><div className="metric-unit">from 45% baseline</div></div>
      <div className="metric"><div className="metric-label">FCR Reduction</div><div className="metric-value green">−0.7</div><div className="metric-unit">BSF Feed Conversion</div></div>
    </div>
    <div className="tbl-wrap" style={{borderTop: '1.5px solid var(--border)'}}>
      <table>
        <thead><tr><th className="left">Metric</th><th>Arthrospira platensis (Spirulina)</th><th>Chlorella vulgaris</th><th className="left">Notes</th></tr></thead>
        <tbody>
          <tr><td className="fn">Biomass Yield Per L POME</td><td className="num">1.25 g DM/L</td><td className="num">1.10 g DM/L</td><td className="note">POME as nutrient medium, tropical sunlight</td></tr>
          <tr><td className="fn">Total Algae / Tonne EFB DM (1,850 L)</td><td className="num">2.31 kg DM</td><td className="num">2.03 kg DM</td><td className="note">1,850 L × yield / 1000</td></tr>
          <tr><td className="fn">Crude Protein (CP) % DM</td><td className="num" style={{color: 'var(--amber)'}}>65%</td><td className="num">45%</td><td className="note">Spirulina significantly higher CP</td></tr>
          <tr><td className="fn">Direct Protein Added / t EFB DM</td><td className="num" style={{color: 'var(--amber)'}}>+1.50 kg</td><td className="num">+0.91 kg</td><td className="note">Small but hyper-potent micronutrient starter</td></tr>
          <tr><td className="fn">Amino Acid Profile</td><td className="fn">High Methionine + Lysine</td><td className="fn">High Lysine</td><td className="note">Fills EFB amino acid gaps — Met + Lys deficient</td></tr>
          <tr><td className="fn">BSF Neonate Survival Boost</td><td className="num" style={{color: 'var(--green)'}}>+22%</td><td className="num">+15%</td><td className="note">Neonates gorge on soft algae cells in first 48h</td></tr>
          <tr><td className="fn">Impact On Final BSF FCR</td><td className="num" style={{color: 'var(--green)'}}>FCR −0.7</td><td className="num">FCR −0.5</td><td className="note">BSF digest EFB faster — gut flora boosted</td></tr>
          <tr><td className="fn">Final BSF Meal CP (Baseline 45%)</td><td className="num" style={{color: 'var(--amber)'}}>45% → 56%</td><td className="num">45% → 51%</td><td className="note">Algae unlocks EFB protein, not just adds its own</td></tr>
          <tr><td className="fn">Optimal Culture Temp</td><td className="fn" style={{color: 'var(--green)'}}>25–38°C (tropical)</td><td className="fn">20–30°C (check shade)</td><td className="note">Spirulina better suited to Indonesian heat</td></tr>
          <tr><td className="fn">Doubling Time</td><td className="num">3–5 days</td><td className="num">2–4 days</td><td className="note">Chlorella faster doubling; Spirulina higher yield/L</td></tr>
          <tr><td className="fn">Harvesting Method</td><td className="fn">Sedimentation / skimming</td><td className="fn">Centrifuge or floc</td><td className="note">Spirulina simpler harvest — no centrifuge needed</td></tr>
          <tr><td className="fn">POME BOD Removal</td><td className="num">40–55%</td><td className="num">35–50%</td><td className="note">Algae culture pre-treats POME — environmental co-benefit</td></tr>
          <tr><td className="fn">BSF Meal Market Grade + Price</td><td className="fn" style={{color: 'var(--amber)'}}>Premium ($4,500–6,500/t)</td><td className="fn">Mid-Premium ($3,500–4,500/t)</td><td className="note">With 9-org stack + FSSC 22000 cert</td></tr>
          <tr><td className="fn">Monthly OpEx</td><td className="num" style={{color: 'var(--green)'}}>$0 (CapEx only)</td><td className="num" style={{color: 'var(--green)'}}>$0 (CapEx only)</td><td className="note">Raceway ponds + POME = zero marginal cost</td></tr>
          <tr><td className="fn" style={{fontWeight: '700', color: 'var(--teal)'}}>CFI Recommendation</td><td className="fn" style={{color: 'var(--green)', fontWeight: '700'}}>PRIMARY CHOICE</td><td className="fn" style={{color: 'var(--greyLt)'}}>Backup Option</td><td className="note">Spirulina = higher protein + tropical temp tolerance</td></tr>
        </tbody>
      </table>
    </div>
    {/* CapEx */}
    <div style={{padding: '14px 16px 6px', fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '13px', color: 'var(--amber)', borderTop: '1.5px solid var(--border)'}}>Raceway Pond CapEx Estimate</div>
    <div className="tbl-wrap">
      <table>
        <thead><tr><th className="left">Item</th><th className="left">Specification</th><th>Unit Cost</th><th>Qty</th><th>Total ($)</th><th className="left">Notes</th></tr></thead>
        <tbody>
          <tr><td className="fn">Raceway Pond Construction</td><td className="fn">HDPE-lined, 500 m² × 25 cm deep = 125 m³</td><td className="price">$8,000</td><td>2 ponds</td><td className="num">$16,000</td><td className="note">1 operating + 1 harvesting = covers ~180 m³/day</td></tr>
          <tr><td className="fn">Paddle Wheel Aerator</td><td className="fn">0.5 kW electric × 2 ponds</td><td className="price">$1,500</td><td>2 units</td><td className="num">$3,000</td><td className="note">Keeps algae in suspension; prevents settling</td></tr>
          <tr><td className="fn">POME Feed Pump + Pipe</td><td className="fn">Peristaltic pump + 50m PVC pipe to pond</td><td className="price">$2,500</td><td>1 unit</td><td className="num">$2,500</td><td className="note">Feeds diluted POME from sludge pit</td></tr>
          <tr><td className="fn">Harvest Sedimentation Tank</td><td className="fn">5 m³ settling tank + discharge valve</td><td className="price">$3,000</td><td>1 unit</td><td className="num">$3,000</td><td className="note">Spirulina settles by gravity — no centrifuge needed</td></tr>
          <tr><td className="fn">Substrate Injection Pump</td><td className="fn">Delivers 1,850 L slurry to S3 substrate mixer</td><td className="price">$2,000</td><td>1 unit</td><td className="num">$2,000</td><td className="note">Replaces existing hydration water pump</td></tr>
          <tr><td className="fn">pH / Temp Monitoring Kit</td><td className="fn">Portable meter + logging, 2× probes</td><td className="price">$500</td><td>1 set</td><td className="num">$500</td><td className="note">Monthly calibration required</td></tr>
          <tr><td className="fn">Contingency 20%</td><td>—</td><td>—</td><td>—</td><td className="num">$5,400</td><td>—</td></tr>
          <tr className="capex-total"><td className="fn" style={{color: 'var(--green)', fontWeight: '700'}}>Total CapEx</td><td>—</td><td>—</td><td>—</td><td className="num" style={{color: 'var(--green)', fontWeight: '700'}}>~$32,400</td><td className="note" style={{color: 'var(--green)'}}>Payback &lt; 6 months at $3,500/t BSF meal premium</td></tr>
        </tbody>
      </table>
    </div>
  </div>

        {/* TAB: ONE-SHOT PROTOCOL */}
        <div className={`tab-panel ${activeTab === 'oneshot' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title blue">Section H: One-Shot Protocol — 20-Item Consortium</span>
              <span className="badge badge-blue">Simplified Stack</span>
            </div>
          </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title teal">Section G: One-Shot Inoculation Protocol — $0.65/t FW</span>
      <span className="badge badge-green">Calculated Output</span>
    </div>
    <div className="alert alert-teal"><strong>All 5 organisms added simultaneously — ONE inoculation event only.</strong> Conditions: pH 6.5–8.0 · Temp 35–45°C · Moisture 50–65% · ≥24 hours after PKSA drain.</div>
    <div className="tbl-wrap">
      <table>
        <thead><tr><th>#</th><th className="left">Organism</th><th className="left">Primary Function</th><th className="left">Secondary Function</th><th>$/kg</th><th>Dose % DM</th><th>$/t FW</th><th>Gas Control</th></tr></thead>
        <tbody>
          <tr><td className="num">1</td><td className="name">Lactobacillus EM-4</td><td className="fn">pH Buffer → 5.5–6.0</td><td className="fn">Pathogen Suppression</td><td className="price">$0.17</td><td>0.08</td><td className="num">$0.05</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>CH4 ↓70–80%</span></td></tr>
          <tr><td className="num">2</td><td className="name">Saccharomyces cerevisiae</td><td className="fn">NH3 Retention 50%</td><td className="fn">Sugar Fermentation</td><td className="price">$0.30</td><td>0.10</td><td className="num">$0.11</td><td><span className="pill pill-amber" style={{fontSize: '10px'}}>NH3 ↓50%</span></td></tr>
          <tr><td className="num">3</td><td className="name">Bacillus subtilis</td><td className="fn">Cellulase Production</td><td className="fn">Protease, Lipase</td><td className="price">$0.20</td><td>0.03</td><td className="num">$0.02</td><td><span className="pill pill-green" style={{fontSize: '10px'}}>Aerobic Anti-CH4</span></td></tr>
          <tr><td className="num">4</td><td className="name">Azotobacter vinelandii</td><td className="fn">N-Fixation +5 kg N/t</td><td className="fn">BSF Protein Source</td><td className="price">$0.40</td><td>0.10</td><td className="num">$0.05</td><td>—</td></tr>
          <tr><td className="num">5</td><td className="name">Trichoderma harzianum</td><td className="fn">Ganoderma Biocontrol</td><td className="fn">Cellulase Production</td><td className="price">$1.50</td><td>0.08</td><td className="num">$0.42</td><td>—</td></tr>
          <tr className="total-row"><td colspan="5" style={{textAlign: 'right', padding: '8px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '700'}}>Total One-Shot</td><td></td><td className="num" style={{color: 'var(--green)', fontSize: '14px'}}>$0.65</td><td style={{fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '700', color: 'var(--pastelGreen)'}}>CH4 ↓70% · NH3 ↓50%</td></tr>
        </tbody>
      </table>
    </div>
    <div style={{padding: '14px 16px 0', fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '13px', color: 'var(--amber)'}}>Monthly Cost At 8,157 t FW/month</div>
    <div className="kv-grid cols3">
      <div className="kv-pair"><div className="kv-key">Monthly Bio Cost</div><div className="kv-val amber">$5,302</div></div>
      <div className="kv-pair"><div className="kv-key">Annual Bio Cost</div><div className="kv-val amber">$63,624</div></div>
      <div className="kv-pair"><div className="kv-key">PKSA (Ash) Cost</div><div className="kv-val green">$0.00 — Free Mill Waste</div></div>
    </div>
  </div>
  </div>

        {/* TAB: GAS EMISSIONS */}
        <div className={`tab-panel ${activeTab === 'gas' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title purple">Section I: Gas Emissions & Environmental Impact</span>
              <span className="badge badge-purple">Life Cycle Data</span>
            </div>
          </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title amber">Section H: Gas Emissions — CH4, CO2, NH3 Control</span>
      <span className="badge badge-amber">Calculated</span>
    </div>
    <div className="tbl-wrap">
      <table>
        <thead><tr><th className="left">Phase</th><th>Days</th><th>Temp °C</th><th>CH4 Methane</th><th>CO2</th><th>NH3 Ammonia</th><th>Most Critical</th><th className="left">Why</th></tr></thead>
        <tbody>
          <tr><td className="fn">PKSA Soak</td><td>0–0.06</td><td>28–35</td><td><span className="pill pill-green" style={{fontSize: '10px'}}>None</span></td><td><span className="pill pill-grey" style={{fontSize: '10px'}}>Low</span></td><td><span className="pill pill-green" style={{fontSize: '10px'}}>None</span></td><td>—</td><td className="note">Alkaline suppresses all emissions</td></tr>
          <tr><td className="fn">Neutralization</td><td>0.06–1</td><td>35–52</td><td><span className="pill pill-amber" style={{fontSize: '10px'}}>Moderate</span></td><td><span className="pill pill-amber" style={{fontSize: '10px'}}>Moderate</span></td><td><span className="pill pill-grey" style={{fontSize: '10px'}}>Low</span></td><td>CH4</td><td className="note">Anaerobic pockets forming</td></tr>
          <tr className="amber-row"><td className="fn" style={{color: 'var(--amber)'}}>Thermophilic</td><td>1–7</td><td>50–70</td><td><span className="pill pill-grey" style={{fontSize: '10px'}}>Low (aerobic)</span></td><td><span className="pill pill-red" style={{fontSize: '10px'}}>Highest</span></td><td><span className="pill pill-red" style={{fontSize: '10px'}}>Highest</span></td><td style={{color: 'var(--amber)'}}>NH3</td><td className="note" style={{color: 'var(--amber)'}}>Add controls here — peak N loss</td></tr>
          <tr><td className="fn">Mesophilic</td><td>7–21</td><td>40–50</td><td><span className="pill pill-grey" style={{fontSize: '10px'}}>Low</span></td><td><span className="pill pill-amber" style={{fontSize: '10px'}}>Moderate</span></td><td><span className="pill pill-amber" style={{fontSize: '10px'}}>Moderate</span></td><td>—</td><td className="note">N-fixers compensate NH3 loss</td></tr>
          <tr><td className="fn">Maturation</td><td>21+</td><td>&lt;40</td><td><span className="pill pill-green" style={{fontSize: '10px'}}>Very Low</span></td><td><span className="pill pill-grey" style={{fontSize: '10px'}}>Low</span></td><td><span className="pill pill-grey" style={{fontSize: '10px'}}>Low</span></td><td>—</td><td className="note">Stable</td></tr>
        </tbody>
      </table>
    </div>
    <div style={{padding: '14px 16px 6px', borderTop: '1.5px solid var(--border)', fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '13px', color: 'var(--amber)'}}>How Each Organism Controls Gas</div>
    <div className="tbl-wrap">
      <table>
        <thead><tr><th className="left">Organism</th><th>Target Gas</th><th>Reduction %</th><th className="left">Mechanism</th><th>When Active</th></tr></thead>
        <tbody>
          <tr><td className="name">Lactobacillus EM-4</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>CH4</span></td><td className="num">70–80%</td><td className="fn">Drops pH to 5.5–6.0 → methanogens die (need pH &gt;6.5)</td><td>Day 1–7</td></tr>
          <tr><td className="name">Saccharomyces cerevisiae</td><td><span className="pill pill-amber" style={{fontSize: '10px'}}>NH3</span></td><td className="num">50%</td><td className="fn">Consumes NH4+ → converts to yeast protein</td><td>Day 1–14</td></tr>
          <tr><td className="name">Saccharomyces cerevisiae</td><td><span className="pill pill-grey" style={{fontSize: '10px'}}>CO2</span></td><td className="num">20–30%</td><td className="fn">Shifts carbon to ethanol instead of CO2</td><td>Day 1–7</td></tr>
          <tr><td className="name">Bacillus subtilis</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>CH4 Indirect</span></td><td>—</td><td className="fn">Maintains aerobic conditions → prevents anaerobic CH4</td><td>Day 1–21</td></tr>
          <tr><td className="name">Trichoderma harzianum</td><td><span className="pill pill-grey" style={{fontSize: '10px'}}>CO2 Indirect</span></td><td>—</td><td className="fn">Rapid cellulose breakdown → shorter thermophilic phase</td><td>Day 3–14</td></tr>
        </tbody>
      </table>
    </div>
    <div style={{padding: '14px 16px 6px', borderTop: '1.5px solid var(--border)', fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '13px', color: 'var(--amber)'}}>Value Of Gas Control</div>
    <div className="tbl-wrap">
      <table>
        <thead><tr><th className="left">Gas</th><th>Uncontrolled Loss</th><th>$ Value Lost</th><th>With Control</th><th>$ Value Saved</th></tr></thead>
        <tbody>
          <tr><td className="name">NH3 (N Loss)</td><td>15–30 kg N/t DM</td><td className="price">$8–15/t FW</td><td>7–15 kg N/t DM</td><td className="num">$4–8/t FW saved</td></tr>
          <tr><td className="name">CH4 (GHG)</td><td>MCF 0.40 (moderate)</td><td className="price">Carbon Credit Loss</td><td>MCF 0.08 (very low)</td><td className="num">Credits Retained</td></tr>
          <tr><td className="name">CO2 (C Loss)</td><td>10% DM as CO2</td><td className="price">C Sequestration Loss</td><td>7–8% DM as CO2</td><td className="num">More C In Product</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>

{/* ══════════════ TAB: PKSA ══════════════ */}

        {/* TAB: POTASSIUM PKSA */}
        <div className={`tab-panel ${activeTab === 'pksa' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title amber">Section J: Potassium & PKSA Biochemistry</span>
              <span className="badge badge-amber">K-Budget</span>
            </div>
          </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title teal">Section I: Potassium From PKSA — Free Nutrient Boost</span>
      <span className="badge badge-green">Calculated Output</span>
    </div>
    <div className="alert alert-green"><strong>PKSA = $0.00/kg — Free Mill Boiler Waste.</strong> 294 t/month at 60 TPH mill. K₂O content 35–45% DM. SNI 19-7030-2004 requires min 0.2% K₂O — CFI delivers 10–27× more.</div>
    <div className="kv-grid cols3">
      <div className="kv-pair"><div className="kv-key">K₂O Content</div><div className="kv-val amber">35–45% DM</div></div>
      <div className="kv-pair"><div className="kv-key">CaO Content</div><div className="kv-val">8–12% DM</div></div>
      <div className="kv-pair"><div className="kv-key">MgO Content</div><div className="kv-val">3–5% DM</div></div>
      <div className="kv-pair"><div className="kv-key">P₂O₅ Content</div><div className="kv-val">1–2% DM</div></div>
      <div className="kv-pair"><div className="kv-key">pH</div><div className="kv-val amber">10–12</div></div>
      <div className="kv-pair"><div className="kv-key">Availability At 60 TPH</div><div className="kv-val green">294 t/month</div></div>
    </div>
    <div style={{padding: '14px 16px 6px', borderTop: '1.5px solid var(--border)', fontFamily: "'Syne', sans-serif", fontWeight: '700', fontSize: '13px', color: 'var(--amber)'}}>K Contribution To Final Compost</div>
    <div className="tbl-wrap">
      <table>
        <thead><tr><th className="left">Source</th><th>K Content % DM</th><th>Contribution To Blend</th><th className="left">Calculation</th></tr></thead>
        <tbody>
          <tr><td className="fn">EFB (60% Of Blend)</td><td className="num">2.21%</td><td className="num">1.33% K DM</td><td className="note">0.60 × 2.21%</td></tr>
          <tr><td className="fn">OPDC (40% Of Blend)</td><td className="num">2.20%</td><td className="num">0.88% K DM</td><td className="note">0.40 × 2.20%</td></tr>
          <tr><td className="fn">PKSA Addition (3–5% DM)</td><td className="fn">35–45% K₂O → 29–37% K</td><td className="num">+0.9–1.9% K DM</td><td className="note">0.04 × 32% K × 0.83 K/K₂O</td></tr>
          <tr className="total-row"><td className="fn">Total K In Substrate</td><td>—</td><td className="num" style={{color: 'var(--pastelGreen)'}}>3.1–4.1% K DM</td><td className="note">Sum Of Above</td></tr>
          <tr className="total-row"><td className="fn">Final CFI Compost K₂O</td><td>—</td><td className="num" style={{color: 'var(--pastelGreen)'}}>2.0–5.4% K₂O</td><td className="note">After Composting Concentration</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>
</div>


        {/* TAB: REFERENCES */}
        <div className={`tab-panel ${activeTab === 'refs' ? 'active' : ''}`}>
          <div className="section">
            <div className="section-header">
              <span className="section-title teal">Section K: References & Citations</span>
              <span className="badge badge-teal">Scientific Literature</span>
            </div>
          </div>
  <div className="section">
    <div className="section-header">
      <span className="section-title amber">Section K: References — 24 Sources | Literature + Supplier Quotes</span>
      <span className="badge badge-amber">Calculated</span>
    </div>
    <div className="alert alert-teal">All values traceable to peer-reviewed literature or supplier quotes. AMBER = verify before commercial use. v2.0 Mar 2026 adds refs [16]–[24] (Rhizopus, Algae, Bt guardrail update).</div>
    <div className="tbl-wrap">
      <table>
        <thead><tr><th>Ref</th><th>Type</th><th className="left">Source</th><th className="left">Description</th><th className="left">Link</th><th className="left">Used For</th></tr></thead>
        <tbody>
          <tr><td className="num">[1]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Santosa IPB 2024</td><td className="note">Provibio 9-organism ICBB strains</td><td className="fn">ab2ti.org/provibio</td><td className="note">Organism registry</td></tr>
          <tr><td className="num">[2]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Kurniawan 2021</td><td className="note">Cellulolytic bacteria on EFB</td><td className="fn">Metamorfosa Univ Riau</td><td className="note">B. subtilis data</td></tr>
          <tr><td className="num">[3]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">DOI:10.1016/j.biortech</td><td className="note">White-rot fungi lignin degradation</td><td className="fn">Bioresource Technology</td><td className="note">Phanerochaete, Pleurotus</td></tr>
          <tr><td className="num">[4]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">DOI:10.1016/j.cej.2025</td><td className="note">Trichoderma + B. subtilis synergy</td><td className="fn">Chemical Engineering Journal</td><td className="note">Consortium synergy</td></tr>
          <tr><td className="num">[5]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">DOI:10.1128/jb.84.1</td><td className="note">Azotobacter cyst heat resistance</td><td className="fn">J. Bacteriology</td><td className="note">Temp gates</td></tr>
          <tr><td className="num">[6]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Parodi et al. 2020</td><td className="note">BSF N partitioning</td><td className="fn">Waste Management 102</td><td className="note">BSF nutrition</td></tr>
          <tr><td className="num">[7]</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>Supplier</span></td><td className="fn">Tokopedia</td><td className="note">Pleurotus spawn retail pricing</td><td className="fn">tokopedia.com/bibit-jamur</td><td className="note">Pricing $/kg</td></tr>
          <tr><td className="num">[8]</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>Supplier</span></td><td className="fn">IndiaMART</td><td className="note">Bulk biofertiliser India</td><td className="fn">indiamart.com</td><td className="note">Pricing $/kg</td></tr>
          <tr><td className="num">[9]</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>Supplier</span></td><td className="fn">HumicFactory India</td><td className="note">Azotobacter $0.40/kg — cheapest N-fixer</td><td className="fn">indiamart.com/humicfactory</td><td className="note">Cheapest N-fixer</td></tr>
          <tr><td className="num">[10]</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>Supplier</span></td><td className="fn">Alibaba</td><td className="note">Bulk enzymes China</td><td className="fn">alibaba.com</td><td className="note">Enzyme pricing</td></tr>
          <tr><td className="num">[11]</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>Supplier</span></td><td className="fn">Novozymes Indonesia</td><td className="note">Cellulase, Lipase — industrial enzymes</td><td className="fn">novozymes.com</td><td className="note">Industrial enzymes</td></tr>
          <tr><td className="num">[12]</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>Supplier</span></td><td className="fn">IPB ICBB Bogor</td><td className="note">ICBB strain collection — Provibio organisms</td><td className="fn">ipb.ac.id</td><td className="note">Provibio organisms</td></tr>
          <tr><td className="num">[13]</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>Supplier</span></td><td className="fn">PT Petrokimia Gresik</td><td className="note">N-fixer biofertiliser Indonesia</td><td className="fn">petrokimia-gresik.com</td><td className="note">Indonesian N-fixers</td></tr>
          <tr><td className="num">[14]</td><td><span className="pill pill-teal" style={{fontSize: '10px'}}>Supplier</span></td><td className="fn">EM-4 retail</td><td className="note">Lactobacillus EM-4 Rp 25,000/L</td><td className="fn">tokopedia.com/em4</td><td className="note">pH buffering</td></tr>
          <tr><td className="num">[15]</td><td><span className="pill pill-green" style={{fontSize: '10px'}}>CFI</span></td><td className="fn">CFI Confirmed Internal</td><td className="note">OPDC N 2.4% DM, yield 15.2%</td><td className="fn">Internal spec</td><td className="note">Locked values</td></tr>
          <tr><td className="num">[16]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Nout &amp; Kiers 2005</td><td className="note">Rhizopus oligosporus in tempeh: protease, phytase, amino acid enrichment</td><td className="fn">DOI:10.1111/j.1365-2621.2005.tb07124.x</td><td className="note">Rhizopus dosing + function</td></tr>
          <tr><td className="num">[17]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Bau et al. 1997</td><td className="note">Rhizopus oligosporus improves protein bioavailability of fibrous substrates</td><td className="fn">J. Agric. Food Chem. 45(3)</td><td className="note">Rhizopus CP uplift</td></tr>
          <tr><td className="num">[18]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Holman et al. 2012</td><td className="note">Spirulina as BSF larval feed supplement</td><td className="fn">Aquaculture 346–349</td><td className="note">Spirulina-BSF uplift</td></tr>
          <tr><td className="num">[19]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Becker 2007</td><td className="note">Micro-algae: biotechnology — Spirulina CP 65%</td><td className="fn">Cambridge University Press</td><td className="note">Spirulina proximate values</td></tr>
          <tr><td className="num">[20]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Richmond 2004</td><td className="note">Handbook of Microalgal Culture — Chlorella CP 45%, yield per L</td><td className="fn">Blackwell Science</td><td className="note">Chlorella proximate values</td></tr>
          <tr><td className="num">[21]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Becker 2013</td><td className="note">Microalgae in human and animal nutrition — amino acid profiles Spirulina vs Chlorella</td><td className="fn">Handbook Microalgal Culture 2nd ed.</td><td className="note">Algae amino acid profiles</td></tr>
          <tr><td className="num">[22]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Lam &amp; Lee 2012</td><td className="note">Microalgae cultivation using POME as nutrient source</td><td className="fn">Bioresource Technology 109: 235–242</td><td className="note">POME algae culture feasibility</td></tr>
          <tr><td className="num">[23]</td><td><span className="pill pill-blue" style={{fontSize: '10px'}}>Literature</span></td><td className="fn">Gupta et al. 2019</td><td className="note">Trichoderma-Rhizopus interaction: mycoparasitism and timing strategy</td><td className="fn">Biological Control 134: 80–89</td><td className="note">Wave timing conflict engine</td></tr>
          <tr className="amber-row"><td className="num" style={{color: 'var(--amber)'}}>[24]</td><td><span className="pill pill-amber" style={{fontSize: '10px'}}>CFI Guardrail</span></td><td className="fn" style={{color: 'var(--amber)'}}>CFI Mar 2026</td><td className="note" style={{color: 'var(--amber)'}}>Bt ICBB 6095 status change: EXCLUDED → CONDITIONAL. S3 phase only; titre decay &lt;10⁴ CFU/g before S4.</td><td className="fn">Internal: CFI-BIO-2026-03</td><td className="note" style={{color: 'var(--amber)'}}>Bt status update</td></tr>
        </tbody>
              </table>
            </div>
  </div>
          </div>
        </div>

      </div>{/* end content */}
      </div>{/* end page-header */}
      </div>{/* end global-header */}
    </div>
  );
};

export default S3BiologyLibrary;
