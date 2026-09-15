import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { NdaDocument } from "@/lib/nda/template";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.5,
    paddingTop: 64,
    paddingBottom: 72,
    paddingHorizontal: 64,
    color: "#111111",
  },
  title: {
    fontFamily: "Times-Bold",
    fontSize: 16,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 24,
  },
  paragraph: { textAlign: "justify", marginBottom: 8 },
  heading: { fontFamily: "Times-Bold", marginTop: 8, marginBottom: 2 },
  closing: { marginTop: 16, marginBottom: 32 },
  signatures: { flexDirection: "row", gap: 40 },
  signatureBlock: { flex: 1 },
  partyName: { fontFamily: "Times-Bold", marginBottom: 14 },
  signatureLine: { flexDirection: "row", marginBottom: 14 },
  signatureLabel: { width: 40 },
  signatureRule: { flex: 1, borderBottomWidth: 1, borderBottomColor: "#555555" },
  pageNumber: {
    position: "absolute",
    bottom: 36,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    color: "#666666",
  },
});

interface NdaPdfProps {
  document: NdaDocument;
}

/** PDF rendering of the agreement; mirrors NdaPreview but uses react-pdf primitives. */
export function NdaPdf({ document }: NdaPdfProps) {
  return (
    <Document title={document.title} author="prelegal">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{document.title}</Text>
        <Text style={styles.paragraph}>{document.preamble}</Text>

        {document.sections.map((section) => (
          <View key={section.heading}>
            <Text style={styles.heading} minPresenceAhead={40}>
              {section.heading}
            </Text>
            {section.paragraphs.map((paragraph, i) => (
              <Text key={i} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.closing}>{document.closing}</Text>

        <View style={styles.signatures} wrap={false}>
          {document.signatureBlocks.map((block, i) => (
            <View key={i} style={styles.signatureBlock}>
              <Text style={styles.partyName}>{block.partyName}</Text>
              {["By", "Name", "Title", "Date"].map((label) => (
                <View key={label} style={styles.signatureLine}>
                  <Text style={styles.signatureLabel}>{label}:</Text>
                  <View style={styles.signatureRule} />
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text
          style={styles.pageNumber}
          fixed
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </Page>
    </Document>
  );
}
