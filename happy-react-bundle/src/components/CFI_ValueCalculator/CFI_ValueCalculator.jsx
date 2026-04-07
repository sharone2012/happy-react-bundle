import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * CFI Value Calculator
 * 
 * Calculates Total Avoided Replacement Value (TARV) for CFI biofertiliser
 * across all stages: S0, S1, S2, S3, S5A, S5B
 * 
 * Fetches live prices from cfi_fertiliser_prices table
 * Shows replacement value + TARV per tonne and per hectare
 */

const CFI_ValueCalculator = ({ defaultStage = 's0' }) => {
  const [activeStage, setActiveStage] = useState(defaultStage);
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Stage configuration
  const stages = {
    s0: { label: 'S0 Raw Residue', color: '#8B9DC3' },
    s1: { label: 'S1 Mechanical', color: '#40D7C5' },
    s2: { label: 'S2 Alkaline', color: '#F5A623' },
    s3: { label: 'S3 Biological', color: '#00A249' },
    s5a: { label: 'S5A BSF Frass', color: '#D4A017' },
    s5b: { label: 'S5B BSF Protein', color: '#E74C3C' }
  };

  // Nutrient profiles per stage (kg/tonne DM)
  const nutrientProfiles = {
    s0: { n: 7.6, p: 0.6, k: 7.4, mg: 0, ca: 0 },
    s1: { n: 7.6, p: 0.6, k: 7.4, mg: 0, ca: 0 },
    s2: { n: 7.6, p: 1.2, k: 7.4, mg: 8.5, ca: 12.0 },
    s3: { n: 9.5, p: 1.2, k: 7.4, mg: 8.5, ca: 12.0 },
    s5a: { n: 32.5, p: 18.0, k: 12.5, mg: 8.5, ca: 35.0 },
    s5b: { n: 420.0, p: 0, k: 0, mg: 0, ca: 0 }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('cfi_fertiliser_prices')
        .select('*');

      if (error) throw error;

      // Map to price object
      const priceMap = {};
      data.forEach(row => {
        priceMap[row.nutrient_id] = row.price_usd_per_tonne;
      });

      setPrices(priceMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setLoading(false);
    }
  };

  const calculateValue = (stage) => {
    if (!prices) return null;

    const profile = nutrientProfiles[stage];
    
    // N value (from Urea 46-0-0)
    const nValue = (profile.n / 460) * (prices.urea_46_0_0 || 0);
    
    // P value (from DAP 18-46-0, using P₂O₅ content)
    const pValue = (profile.p / 460) * (prices.dap_18_46_0 || 0);
    
    // K value (from MOP 0-0-60, using K₂O content)
    const kValue = (profile.k / 600) * (prices.mop_0_0_60 || 0);
    
    // Mg value (from Kieserite)
    const mgValue = (profile.mg / 1000) * (prices.kieserite || 0);
    
    // Ca value (from Ag Lime)
    const caValue = (profile.ca / 1000) * (prices.ag_lime_caco3 || 0);
    
    const replacementValue = nValue + pValue + kValue + mgValue + caValue;
    
    // TARV = 60% of replacement value (CFI margin)
    const tarv = replacementValue * 0.60;
    
    // Per hectare (assuming 2.5 t/ha application rate)
    const tarvPerHa = tarv * 2.5;

    return {
      n: nValue,
      p: pValue,
      k: kValue,
      mg: mgValue,
      ca: caValue,
      replacement: replacementValue,
      tarv: tarv,
      tarvPerHa: tarvPerHa
    };
  };

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        Loading prices...
      </div>
    );
  }

  const currentValue = calculateValue(activeStage);

  return (
    <div style={{
      background: '#0B1422',
      border: '1.5px solid #1E6B8C',
      borderRadius: '8px',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
      color: '#FFFFFF'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(30, 107, 140, 0.3)'
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontFamily: "'Syne', sans-serif",
            fontSize: '18px',
            fontWeight: '700',
            color: '#40D7C5'
          }}>
            VALUE CALCULATOR
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)'
          }}>
            Total Avoided Replacement Value (TARV)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '8px 16px',
            background: 'rgba(64, 215, 197, 0.1)',
            border: '1px solid #40D7C5',
            borderRadius: '6px',
            color: '#40D7C5',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          How We Calculate
        </button>
      </div>

      {/* Stage Selector */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {Object.entries(stages).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveStage(key)}
            style={{
              padding: '8px 16px',
              background: activeStage === key 
                ? `rgba(${hexToRgb(config.color)}, 0.2)` 
                : 'rgba(12, 30, 51, 0.6)',
              border: activeStage === key 
                ? `1.5px solid ${config.color}` 
                : '1.5px solid rgba(139, 160, 180, 0.18)',
              borderRadius: '6px',
              color: activeStage === key ? config.color : 'rgba(255,255,255,0.5)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Value Display */}
      {currentValue && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {/* Replacement Value */}
          <div style={{
            padding: '16px',
            background: 'rgba(139, 160, 180, 0.08)',
            border: '1px solid rgba(139, 160, 180, 0.18)',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              Replacement Value
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              fontFamily: "'DM Mono', monospace",
              color: '#8B9DC3'
            }}>
              ${currentValue.replacement.toFixed(2)}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '4px'
            }}>
              per tonne DM
            </div>
          </div>

          {/* TARV */}
          <div style={{
            padding: '16px',
            background: 'rgba(64, 215, 197, 0.12)',
            border: '1.5px solid #40D7C5',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '10px',
              color: '#40D7C5',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              TARV (60%)
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              fontFamily: "'DM Mono', monospace",
              color: '#40D7C5'
            }}>
              ${currentValue.tarv.toFixed(2)}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(64, 215, 197, 0.6)',
              marginTop: '4px'
            }}>
              per tonne DM
            </div>
          </div>

          {/* TARV per Ha */}
          <div style={{
            padding: '16px',
            background: 'rgba(245, 166, 35, 0.12)',
            border: '1.5px solid #F5A623',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '10px',
              color: '#F5A623',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              fontWeight: '600'
            }}>
              TARV per Hectare
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              fontFamily: "'DM Mono', monospace",
              color: '#F5A623'
            }}>
              ${currentValue.tarvPerHa.toFixed(0)}
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(245, 166, 35, 0.6)',
              marginTop: '4px'
            }}>
              @ 2.5 t/ha rate
            </div>
          </div>
        </div>
      )}

      {/* Breakdown */}
      {currentValue && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(6, 12, 20, 0.6)',
          borderRadius: '6px',
          border: '1px solid rgba(139, 160, 180, 0.18)'
        }}>
          <div style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>
            Value Breakdown
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '12px' }}>
            <ValueItem label="N" value={currentValue.n} color="#40D7C5" />
            <ValueItem label="P" value={currentValue.p} color="#F5A623" />
            <ValueItem label="K" value={currentValue.k} color="#00A249" />
            <ValueItem label="Mg" value={currentValue.mg} color="#8B9DC3" />
            <ValueItem label="Ca" value={currentValue.ca} color="#D4A017" />
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <HowWeCalculateModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

const ValueItem = ({ label, value, color }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{
      fontSize: '10px',
      color: 'rgba(255,255,255,0.4)',
      marginBottom: '4px'
    }}>
      {label}
    </div>
    <div style={{
      fontSize: '16px',
      fontWeight: '700',
      fontFamily: "'DM Mono', monospace",
      color: color
    }}>
      ${value.toFixed(2)}
    </div>
  </div>
);

const HowWeCalculateModal = ({ onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: "'DM Sans', sans-serif"
  }} onClick={onClose}>
    <div style={{
      background: '#0B1422',
      border: '1.5px solid #1E6B8C',
      borderRadius: '8px',
      padding: '32px',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto'
    }} onClick={(e) => e.stopPropagation()}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontFamily: "'Syne', sans-serif",
        fontSize: '20px',
        color: '#40D7C5'
      }}>
        How We Calculate TARV
      </h3>
      
      <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
        <p><strong style={{ color: '#40D7C5' }}>Replacement Value</strong> is the cost to buy equivalent NPK from commodity fertilisers:</p>
        <ul style={{ marginLeft: '20px', color: 'rgba(255,255,255,0.6)' }}>
          <li>N from Urea (46-0-0) @ CIF Indonesia price</li>
          <li>P from DAP (18-46-0) @ CIF Indonesia price</li>
          <li>K from MOP (0-0-60) @ CIF Indonesia price</li>
          <li>Mg from Kieserite @ market price</li>
          <li>Ca from Agricultural Lime @ market price</li>
        </ul>

        <p style={{ marginTop: '16px' }}>
          <strong style={{ color: '#F5A623' }}>TARV (Total Avoided Replacement Value)</strong> = 60% of Replacement Value
        </p>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '16px' }}>
          Prices updated every 15 days from ICIS CIF Indonesia reports via Agent 6.
        </p>
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: '24px',
          padding: '10px 20px',
          background: '#40D7C5',
          border: 'none',
          borderRadius: '6px',
          color: '#060C14',
          fontWeight: '600',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        Close
      </button>
    </div>
  </div>
);

// Helper function
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '64, 215, 197';
};

export default CFI_ValueCalculator;
