import React, { useEffect, useState } from 'react';
import { Row, Col, Container, NavLink as Link } from 'reactstrap';
// import { HashLink as Link } from 'react-router-hash-link';
// import { Link } from '@mui/material';
import { callPostAPI } from '@/helper';
import { staticToken } from '@/consts';

const Accordion = () => {

  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndexSub, setActiveIndexSub] = useState(null);
  const [faqList, setFaqList] = useState([]) as any;

  useEffect(() => {
    (async () => {
      const { data = [] } = await callPostAPI("getFAQList", {}, { Authorization: staticToken }) as any;
      if (Array.isArray(data) && data.length > 0) {
        setFaqList(data);
      }
    })();
  }, []);

  const toggleAccordion = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const toggleAccordionSub = (index: any) => {
    setActiveIndexSub(activeIndexSub === index ? null : index);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const handleLoadMore = () => {
    setIsExpanded(true);
  };

  const handleLoadLess = () => {
    setIsExpanded(false);
  };

  return (
    <div className='faqmain'>
      <Container>
        <Row>
          <Col md={12}>
            <div className='faqtitle'>Understand ZBU Protocol</div>
          </Col>
        </Row>
        <Row>
          <Col md={8} className='mx-auto'>
            <div className="accordion">
              {/* <div className="accordion-item">
                <div className="accordion-title" onClick={() => toggleAccordion(0)}>
                  What Is ZBU Protocol ? <Link to="">Learn More</Link> <span>{activeIndex === 0 ? '-' : '+'}</span>
                </div>
                <div className={`accordion-content ${activeIndex === 0 ? 'active' : ''}`}>
                  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, <Link to="">ZEEBU LINK</Link> printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </p>
                  {isExpanded && (
                    <div className="more-content">
                      <div className="accordion">
                        <div className="accordion-item accordion-itemsub">
                          <div className="accordion-title" onClick={() => toggleAccordionSub(0)}>
                            What Is ZBU Protocol ? <Link to="">Learn More</Link> <span>{activeIndexSub === 0 ? '-' : '+'}</span>
                          </div>
                          <div className={`accordion-content ${activeIndexSub === 0 ? 'active' : ''}`}>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, <Link to="">ZEEBU LINK</Link> printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </p>
                          </div>
                        </div>
                        <div className="accordion-item accordion-itemsub">
                          <div className="accordion-title" onClick={() => toggleAccordionSub(1)}>
                            What Is Role Of Deployer? <span>{activeIndexSub === 1 ? '-' : '+'}</span>
                          </div>
                          <div className={`accordion-content ${activeIndexSub === 1 ? 'active' : ''}`}>
                            <p>Content of Section 2</p>
                          </div>
                        </div>
                        <div className="accordion-item accordion-itemsub">
                          <div className="accordion-title" onClick={() => toggleAccordionSub(2)}>
                            What Is Role Of Delegator? <span>{activeIndexSub === 2 ? '-' : '+'}</span>
                          </div>
                          <div className={`accordion-content ${activeIndexSub === 2 ? 'active' : ''}`}>
                            <p>Content of Section 3</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {!isExpanded ? (
                    <button onClick={handleLoadMore}>+ 116 Questions</button>
                  ) : (
                    <button onClick={handleLoadLess}>Load Less</button>
                  )}
                </div>
              </div> */}
              {faqList.length && faqList.map((item: any, key: string) => {

                const { question = '', answer = '', link = '', subQuestions = [] } = item;

                return (question !== '' && answer !== '') ? <div className="accordion-item">
                  <div className="accordion-title" onClick={() => toggleAccordion(key + 1)}>
                    {question} {link !== '' && <Link to={link} target='_blank'>Learn More</Link>} <span>{activeIndex === (key + 1) ? '-' : '+'}</span>
                  </div>
                  <div className={`accordion-content ${activeIndex === (key + 1) ? 'active' : ''}`}>
                    <p style={{ textAlign: "justify" }}>{answer}</p>
                    {isExpanded && (
                      <div className="more-content">
                        <div className="accordion">
                          {subQuestions && subQuestions.map((itemSub: any, keySub: string) => {

                            const { question = '', answer = '', link = '' } = itemSub;
                            return (question !== '' && answer !== '') ? <div className="accordion-item accordion-itemsub">
                              <div className="accordion-title" onClick={() => toggleAccordionSub(keySub + 1)}>
                                {question} {link !== '' && <Link to={link} target='_blank'>Learn More</Link>} <span>{activeIndexSub === (keySub + 1) ? '-' : '+'}</span>
                              </div>
                              <div className={`accordion-content ${activeIndexSub === (keySub + 1) ? 'active' : ''}`}>
                                <p style={{ textAlign: "justify" }}>{answer}</p>
                              </div>
                            </div> : ''
                          })}
                        </div>
                      </div>
                    )}
                    {!isExpanded ? (
                      <button onClick={handleLoadMore}>+{subQuestions.length} Questions</button>
                    ) : (
                      <button onClick={handleLoadLess}>Load Less</button>
                    )}
                  </div>
                </div> : ''
              })}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Accordion;
