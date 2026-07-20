import React from "react";

const styles = `
  .skeleton { background-color: #e2e5e7; background-image: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0)); background-size: 200px 100%; background-repeat: no-repeat; background-position: left -200px top 0; animation: shine 1.5s ease-in-out infinite; }
  @keyframes shine { to { background-position: right -200px top 0; } }
  .skeleton-card { display: flex; flex-direction: column; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); height: 100%; min-height: 420px; }
  .skeleton-image { width: 100%; height: 220px; border-bottom: 1px solid #f0f0f0; }
  .skeleton-content { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; gap: 12px; }
  .skeleton-title { height: 24px; width: 75%; border-radius: 4px; margin-bottom: 8px; }
  .skeleton-text { height: 16px; width: 100%; border-radius: 4px; }
  .skeleton-text-short { height: 16px; width: 50%; border-radius: 4px; }
  .skeleton-text-medium { height: 16px; width: 85%; border-radius: 4px; }
  .skeleton-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; padding-top: 15px; }
  .skeleton-price { height: 24px; width: 40%; border-radius: 4px; }
  .skeleton-button { height: 38px; width: 110px; border-radius: 20px; }
  .skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; width: 100%; }
  @media (max-width: 768px) { .skeleton-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; } }
`

export const SkeletonPackageCard = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="skeleton-card">
        <div className="skeleton-image skeleton"></div>
        <div className="skeleton-content">
          <div className="skeleton-title skeleton"></div>
          <div className="skeleton-text-short skeleton" style={{ marginBottom: "10px" }}></div>
          <div className="skeleton-text-medium skeleton"></div>
          <div className="skeleton-text skeleton"></div>
          <div className="skeleton-footer">
            <div className="skeleton-price skeleton"></div>
            <div className="skeleton-button skeleton"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="skeleton-grid">
      {Array(count).fill().map((_, index) => (
        <SkeletonPackageCard key={index} />
      ))}
    </div>
  );
};
