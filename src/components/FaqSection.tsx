"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Headphones, MessageCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "O que é o Método Maestro?",
    answer: "O Método Maestro é a mentoria presencial definitiva focada em alavancar a carreira de Personal Trainers, ensinando estratégias de posicionamento, vendas de alto valor e construção de autoridade no mercado premium.",
  },
  {
    question: "Como funciona a mentoria?",
    answer: "A mentoria é uma imersão completa com aulas teóricas e práticas, análise de casos e networking qualificado. Você terá um mapa claro do que executar para escalar seus resultados logo após o evento.",
  },
  {
    question: "A mentoria é presencial ou online?",
    answer: "A experiência principal é presencial, projetada para gerar conexão e networking de alto nível. Porém, disponibilizamos acesso a materiais de apoio online na nossa plataforma exclusiva.",
  },
  {
    question: "Qual a data, local e duração do evento?",
    answer: "A imersão presencial acontecerá nos dias 5 e 6 de Setembro na academia World Gym Pro em Salvador - Bahia. Os horários são: Sábado das 15:30h às 20:00h e Domingo das 14:00h às 18:00h.",
  },
  {
    question: "Receberei certificado?",
    answer: "Sim, todos os participantes que concluírem a mentoria receberão um certificado de conclusão com carga horária reconhecida.",
  },
  {
    question: "Terei acesso aos materiais?",
    answer: "Com certeza. Você terá acesso à nossa área de membros com materiais complementares, templates, planilhas e o PDF das aulas ministradas.",
  },
  {
    question: "Os bônus estão inclusos?",
    answer: "Sim, todos os bônus descritos na oferta oficial são destravados imediatamente ou entregues presencialmente conforme as regras da turma.",
  },
  {
    question: "Posso parcelar?",
    answer: "Sim, o pagamento pode ser parcelado em até 12x no cartão de crédito, com as taxas da plataforma informadas no checkout.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos Cartão de Crédito, PIX e Boleto Bancário (apenas à vista para boleto).",
  },
  {
    question: "Como funciona o lote atual?",
    answer: "As vendas funcionam por lotes com quantidades limitadas de ingressos. Assim que um lote esgota, o próximo é iniciado automaticamente com o valor reajustado.",
  },
  {
    question: "O valor aumenta quando virar o lote?",
    answer: "Sim. Recomendamos fortemente garantir seu bilhete no lote atual para aproveitar as melhores condições financeiras, pois não garantimos manutenção do preço.",
  },
  {
    question: "Posso transferir meu ingresso?",
    answer: "A transferência de titularidade é permitida até 7 dias antes do evento, devendo ser solicitada e validada junto ao nosso suporte oficial.",
  },
  {
    question: "Existe política de cancelamento?",
    answer: "Sim, respeitamos o Código de Defesa do Consumidor e oferecemos garantia incondicional de 7 dias após a compra para devolução integral do valor investido.",
  },
  {
    question: "Como receberei meu ingresso?",
    answer: "Após a aprovação do pagamento, você receberá um e-mail com todas as instruções e o QR Code que servirá como seu bilhete de acesso ao evento.",
  },
  {
    question: "Como entro no grupo exclusivo?",
    answer: "Dentro da plataforma onde o seu ingresso é hospedado, haverá um link oficial para ingressar no nosso grupo silencioso de avisos no WhatsApp.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaq = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openWhatsApp = () => {
    window.open(
      "https://wa.me/5500000000000?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20M%C3%A9todo%20Maestro.",
      "_blank"
    );
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 bg-[#080808] relative border-t border-white/5 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-geist text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
            Ainda ficou alguma dúvida?
          </h2>
          <p className="font-inter text-base sm:text-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Respondemos abaixo as perguntas mais comuns antes da compra do bilhete para que você tome sua decisão com total clareza.
          </p>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Buscar dúvida..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#161616] border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/50 text-sm transition-colors"
            />
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaq.length > 0 ? (
            filteredFaq.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-white/10 pb-4 transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className={`w-full flex items-center justify-between text-left py-3 transition-colors text-base sm:text-lg font-semibold outline-none group ${
                      isOpen ? "text-primary" : "text-white hover:text-primary"
                    }`}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-white/50 group-hover:text-primary transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="text-on-surface-variant mt-2 text-sm sm:text-base leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-on-surface-variant py-8">
              Nenhuma pergunta encontrada para &quot;{searchTerm}&quot;.
            </p>
          )}
        </div>

        {/* Support Help Block */}
        <div className="mt-16 glass-card rounded-3xl p-8 sm:p-10 text-center border-primary/20 gold-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Headphones className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-geist text-2xl font-bold mb-3 text-white">
              Ainda precisa de ajuda?
            </h3>
            <p className="text-on-surface-variant mb-8 text-base sm:text-lg max-w-md mx-auto">
              Nossa equipe está pronta para esclarecer qualquer dúvida antes da sua inscrição.
            </p>
            <button
              onClick={openWhatsApp}
              className="w-full sm:w-auto bg-[#25D366] text-white font-geist font-bold uppercase tracking-widest py-4 px-8 rounded-full shadow-[0_0_30px_rgba(37,211,102,0.35)] hover:shadow-[0_0_50px_rgba(37,211,102,0.55)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 mx-auto text-sm sm:text-base"
            >
              <MessageCircle className="w-5 h-5" />
              FALAR COM A EQUIPE VIA WHATSAPP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
