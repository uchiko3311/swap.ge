import React from 'react';

class About extends React.Component<any, any> {
  public componentDidMount() {
    window.scrollTo(0, 0);
  }

  public render() {
    return (
      <div className="block bpp-price-plans">
        <div className="container text-center" style={{ padding: '50px 20px' }}>
          
          {/* სათაური */}
          <div className="row m-b-lg">
            <div className="col-sm-8 col-sm-offset-2 col-lg-6 col-lg-offset-3">
              <h1 className="m-t-0 text-uppercase letter-spacing">ჩვენს შესახებ</h1>
            </div>
          </div>

          {/* ტექსტური ნაწილი */}
          <div className="row">
            <p className="about-text" style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '30px' }}>
              <strong>Swap</strong> არის თავისუფალი ონლაინ პლატფორმა, რომელიც ეხმარება სტუდენტებს ერთმანეთთან დაკავშირებასა და ნივთების გაცვლაში.
            </p>
          </div>

          {/* ღილაკების სექცია */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
            
            {/* ღილაკი 1: გადასვლა მთავარზე */}
            <button 
              onClick={() => window.location.href = '/'}
              style={buttonStyle}
            >
              მთავარი გვერდი
            </button>

            {/* ღილაკი 2: კონტაქტი (იმეილი) */}
            <button 
              onClick={() => window.location.href = 'mailto:swap@gmail.com'}
              style={{ ...buttonStyle, backgroundColor: '#28a745' }}
            >
              მოგვწერეთ
            </button>

            {/* ღილაკი 3: გარე ბმული (მაგალითად Google) */}
            <button 
              onClick={() => window.open('https://google.com', '_blank')}
              style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
            >
              დახმარება
            </button>

          </div>
        </div>
      </div>
    );
  }
}

// ღილაკების სტილი (CSS-ის ნაცვლად პირდაპირ კოდში)
const buttonStyle = {
  padding: '12px 25px',
  fontSize: '16px',
  fontWeight: 'bold' as 'bold',
  color: 'white',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: '0.3s',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

export default About;
