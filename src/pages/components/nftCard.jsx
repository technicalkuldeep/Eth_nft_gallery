export const NFTCard = ({ nft }) => {
  const imageUrl = nft.image.originalUrl;

  return (
    <div className="card">
      <p>{nft.name}</p>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={nft.name}
          style={{ width: "100px", height: "100px" }}
        />
      )}
      {nft.description && <p>{nft.description}</p>}
    </div>
  );
};
