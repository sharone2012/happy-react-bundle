import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * CFI Price Refresh Badge
 * 
 * Displays fertiliser price freshness status and triggers Agent 6 refresh
 * - Green badge: prices updated within last 15 days
 * - Amber badge: prices stale (>15 days old)
 * - Click "Refresh Prices" → calls Supabase Edge Function → triggers GitHub Actions workflow_dispatch
 */

const CFI_PriceRefreshBadge = () => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchPriceStatus();
  }, []);

  const fetchPriceStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('cfi_fertiliser_prices')
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        const updatedDate = new Date(data.updated_at);
        setLastUpdated(updatedDate);

        // Check if stale (>15 days)
        const daysSinceUpdate = (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24);
        setIsStale(daysSinceUpdate > 15);
      }
    } catch (err) {
      console.error('Error fetching price status:', err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Call Supabase Edge Function to trigger GitHub Actions workflow
      const { data, error } = await supabase.functions.invoke('trigger-price-agent', {
        body: { reason: 'user-request' }
      });

      if (error) throw error;

      alert('Price refresh initiated. New prices will be available in ~2 minutes.');
      
      // Re-check status after 3 minutes
      setTimeout(fetchPriceStatus, 180000);
    } catch (err) {
      console.error('Error triggering price refresh:', err);
      alert('Failed to trigger price refresh. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const badgeColor = isStale ? '#F5A623' : '#00A249'; // Amber : Green
  const badgeText = isStale ? 'STALE' : 'FRESH';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '13px'
    }}>
      {/* Status Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        background: 'rgba(11, 20, 34, 0.6)',
        border: `1.5px solid ${badgeColor}`,
        borderRadius: '6px',
        color: badgeColor,
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: badgeColor,
          boxShadow: `0 0 8px ${badgeColor}`
        }} />
        <span>PRICES {badgeText}</span>
        <span style={{ 
          color: 'rgba(255,255,255,0.5)', 
          fontWeight: '400',
          fontFamily: "'DM Mono', monospace"
        }}>
          {formatDate(lastUpdated)}
        </span>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        style={{
          padding: '6px 14px',
          background: isRefreshing ? 'rgba(64, 215, 197, 0.1)' : 'rgba(64, 215, 197, 0.15)',
          border: '1.5px solid #40D7C5',
          borderRadius: '6px',
          color: '#40D7C5',
          fontWeight: '600',
          fontSize: '13px',
          cursor: isRefreshing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.3px',
          opacity: isRefreshing ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!isRefreshing) {
            e.target.style.background = 'rgba(64, 215, 197, 0.25)';
            e.target.style.borderColor = '#33D4BC';
          }
        }}
        onMouseLeave={(e) => {
          if (!isRefreshing) {
            e.target.style.background = 'rgba(64, 215, 197, 0.15)';
            e.target.style.borderColor = '#40D7C5';
          }
        }}
      >
        {isRefreshing ? 'REFRESHING...' : 'REFRESH PRICES'}
      </button>
    </div>
  );
};

export default CFI_PriceRefreshBadge;
