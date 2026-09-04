import { Link } from 'react-router-dom';
import { LegalDocument, LegalSection, LegalParagraph, LegalList } from '../../components/legal/LegalDocument';
import { LEGAL_RESPONSABLE_NOMBRE, LEGAL_RESPONSABLE_NIF, LEGAL_RESPONSABLE_DIRECCION, LEGAL_CONTACT_EMAIL } from '../../data/legalInfo';

export function LegalNoticePage() {
  return (
    <LegalDocument title="Aviso legal">
      <LegalSection heading="1. Datos identificativos">
        <LegalParagraph>
          En cumplimiento del deber de información del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la
          Información y de Comercio Electrónico (LSSI-CE), se informa de los siguientes datos: la aplicación "Roady" es
          titularidad de <strong>{LEGAL_RESPONSABLE_NOMBRE}</strong>, NIF {LEGAL_RESPONSABLE_NIF}, con domicilio en{' '}
          {LEGAL_RESPONSABLE_DIRECCION} y dirección de contacto {LEGAL_CONTACT_EMAIL}.
        </LegalParagraph>
        <LegalParagraph>Estos datos están pendientes de confirmación por el titular y se completarán en cuanto estén disponibles.</LegalParagraph>
      </LegalSection>

      <LegalSection heading="2. Objeto">
        <LegalParagraph>
          Roady es una aplicación web progresiva (PWA) de carácter educativo para preparar el examen teórico del permiso
          de conducción B en España, mediante lecciones, práctica libre y simulacros de examen. Roady{' '}
          <strong>no es una aplicación oficial de la Dirección General de Tráfico (DGT)</strong>, no está afiliada a
          ella, y no garantiza la aprobación del examen oficial.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="3. Condiciones de acceso y uso">
        <LegalParagraph>
          El acceso a determinadas funciones de Roady requiere registro previo mediante cuenta de usuario. El uso de la
          aplicación implica la aceptación de este aviso legal, de la{' '}
          <Link to="/privacidad" style={{ fontWeight: 600 }}>
            Política de privacidad
          </Link>{' '}
          y de los{' '}
          <Link to="/terminos" style={{ fontWeight: 600 }}>
            Términos y condiciones
          </Link>
          .
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="4. Propiedad intelectual e industrial">
        <LegalParagraph>
          El nombre "Roady", su logotipo, diseño, estructura y el contenido educativo original (explicaciones,
          diagramas, redacción de preguntas de práctica) son propiedad de {LEGAL_RESPONSABLE_NOMBRE} o se usan bajo la
          licencia correspondiente, y no pueden reproducirse, distribuirse o transformarse sin autorización, salvo en
          los casos permitidos por la ley.
        </LegalParagraph>
        <LegalParagraph>
          El contenido del banco de preguntas se elabora a partir de fuentes oficiales de la DGT (normativa de
          circulación, manual del permiso B, catálogo de señales); puedes consultar el listado completo de fuentes y su
          estado de revisión en la sección "Fuentes oficiales" de la aplicación. Ninguna pregunta de Roady se presenta
          como pregunta oficial de examen salvo que su fuente lo permita expresamente.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="5. Exclusión de responsabilidad">
        <LegalList
          items={[
            'Roady es una herramienta de apoyo al estudio y no sustituye la formación impartida por una autoescuela ni garantiza el resultado del examen oficial de la DGT.',
            'Nos esforzamos por mantener el contenido actualizado conforme a la normativa vigente, pero no podemos garantizar la ausencia total de errores u omisiones.',
            'No respondemos de interrupciones del servicio derivadas de causas ajenas a nuestro control, como fallos de nuestros proveedores de infraestructura.',
          ]}
        />
      </LegalSection>

      <LegalSection heading="6. Legislación aplicable">
        <LegalParagraph>
          Este aviso legal se rige por la legislación española. Para cualquier controversia derivada del uso de la
          aplicación, y sin perjuicio de los derechos que asistan a los usuarios consumidores conforme a la normativa de
          protección de consumidores, serán competentes los tribunales que correspondan según dicha normativa.
        </LegalParagraph>
      </LegalSection>
    </LegalDocument>
  );
}
