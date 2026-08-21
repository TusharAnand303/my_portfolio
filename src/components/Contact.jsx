import Icon from './Icon'
import WaveWords from './WaveWords'

export default function Contact() {
  return (
    <footer className="contact section-shell" id="contact">
      <div className="contact-line" />
      <p className="eyebrow"><span className="pulse" /><span><WaveWords>Open to meaningful opportunities</WaveWords></span></p>
      <h2><WaveWords>Let's build<br /><i>something that will change the world.</i></WaveWords></h2>
      <div className="contact-methods">
        <a className="contact-email" href="mailto:tusharanand303@gmail.com" data-cursor="MAIL"><WaveWords>tusharanand303@gmail.com </WaveWords><Icon name="arrow" size={27} /></a>
        <a className="contact-phone" href="tel:+919304984077"><WaveWords>+91 93049 84077</WaveWords></a>
      </div>
      <p className="contact-address"><WaveWords>New Shastri Nagar, Madhukam, Ratu Road<br />Ranchi, Jharkhand - 834005, India</WaveWords></p>
      <div className="footer-bottom"><p><WaveWords>COPYRIGHT 2026 TUSHAR ANAND. BUILT WITH INTENTION.</WaveWords></p><div><a href="mailto:tusharanand303@gmail.com"><WaveWords>Email </WaveWords><Icon name="external" size={13} /></a><a href="tel:+919304984077"><WaveWords>Call </WaveWords><Icon name="external" size={13} /></a></div></div>
    </footer>
  )
}
