export default function PortfolioPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return <div>{id}</div>;
}
