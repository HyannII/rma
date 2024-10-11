type HeaderProps = {
  name: string;
};

const Header = ({ name }: HeaderProps) => {
  return <h1 className="text-4xl font-bold uppercase text-gray-700">{name}</h1>;
};

export default Header;
