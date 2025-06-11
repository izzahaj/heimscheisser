const Footer = () => {
  return (
    <>
      <footer className="bg-orange-100 flex flex-grow justify-center">
        © {new Date().getFullYear()} Heimscheißer. Open source under the MIT
        License.
      </footer>
    </>
  );
};

export default Footer;
