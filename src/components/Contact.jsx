import Icon from './Icon'

export default function Contact() {
  return (
    <footer className="contact section-shell" id="contact">
      <div className="contact-line" />
      <p className="eyebrow"><span className="pulse" /> Open to meaningful opportunities</p>
      <h2>Let's build<br /><i>something dependable.</i></h2>
      <div className="contact-methods">
        <a className="contact-email" href="mailto:tusharanand303@gmai.com">tusharanand303@gmai.com <Icon name="arrow" size={27} /></a>
        <a className="contact-phone" href="tel:+919304984077">+91 93049 84077</a>
      </div>
      <p className="contact-address">New Shastri Nagar, Madhukam, Ratu Road<br />Ranchi, Jharkhand - 834005, India</p>
      <div className="footer-bottom"><p>COPYRIGHT 2026 TUSHAR ANAND. BUILT WITH INTENTION.</p><div><a href="mailto:tusharanand303@gmai.com">Email <Icon name="external" size={13} /></a><a href="tel:+919304984077">Call <Icon name="external" size={13} /></a></div></div>
    </footer>
  )
}
