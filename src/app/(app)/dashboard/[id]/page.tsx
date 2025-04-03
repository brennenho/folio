type PortfolioPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PortfolioPage(props: PortfolioPageProps) {
  const params = await props.params;
  const { id } = params;
  return <div>{id}</div>;
}
