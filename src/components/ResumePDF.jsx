import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#161B22",
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 2,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    fontSize: 9,
    color: "#5B6472",
  },
  contactItem: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 4,
    borderBottom: "1 solid #E2E5EA",
    paddingBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  paragraph: {
    marginBottom: 2,
  },
  projectBlock: {
    marginBottom: 6,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 1,
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 1,
  },
  keywordsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  keyword: {
    fontSize: 8,
    backgroundColor: "#F0F2F5",
    color: "#2B4C7E",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  eduRow: {
    marginBottom: 4,
  },
  eduDegree: {
    fontWeight: 700,
    fontSize: 10,
  },
  eduMeta: {
    fontSize: 9,
    color: "#5B6472",
  },
  link: {
    color: "#2B4C7E",
    textDecoration: "none",
  },
});

function ResumePDF({ resume, profile, targetRole }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{profile.fullName}</Text>

        <View style={styles.contactRow}>
          {profile.user?.email && (
            <Text style={styles.contactItem}>{profile.user.email}</Text>
          )}
          {profile.phone && (
            <Text style={styles.contactItem}>· {profile.phone}</Text>
          )}
          {profile.location && (
            <Text style={styles.contactItem}>· {profile.location}</Text>
          )}
          {profile.portfolioUrl && (
            <Link
              src={profile.portfolioUrl}
              style={[styles.link, styles.contactItem]}
            >
              · Portfolio
            </Link>
          )}
          {profile.githubUrl && (
            <Link
              src={profile.githubUrl}
              style={[styles.link, styles.contactItem]}
            >
              · GitHub
            </Link>
          )}
          {profile.linkedinUrl && (
            <Link
              src={profile.linkedinUrl}
              style={[styles.link, styles.contactItem]}
            >
              · LinkedIn
            </Link>
          )}
        </View>

        <Text style={styles.sectionTitle}>Summary — {targetRole}</Text>
        <Text style={styles.paragraph}>{resume.summary}</Text>

        {profile.skills?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.paragraph}>{profile.skills.join(", ")}</Text>
          </>
        )}

        {resume.projectBullets?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projectBullets.map((proj) => (
              <View key={proj.projectName} style={styles.projectBlock}>
                <Text style={styles.projectName}>{proj.projectName}</Text>
                {proj.bullets.map((b, i) => (
                  <Text key={i} style={styles.bullet}>
                    • {b}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        {profile.education?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Education</Text>
            {profile.education.map((edu) => (
              <View key={edu.id} style={styles.eduRow}>
                <Text style={styles.eduDegree}>{edu.degree}</Text>
                <Text style={styles.eduMeta}>
                  {edu.institution} · {edu.startYear}
                  {edu.endYear ? ` – ${edu.endYear}` : ""}
                </Text>
              </View>
            ))}
          </>
        )}

        {profile.certificates?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {profile.certificates.map((cert) => (
              <View key={cert.id} style={styles.eduRow}>
                <Text style={styles.eduDegree}>{cert.name}</Text>
                <Text style={styles.eduMeta}>{cert.issuer}</Text>
              </View>
            ))}
          </>
        )}

        {resume.atsKeywords?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Keywords</Text>
            <View style={styles.keywordsRow}>
              {resume.atsKeywords.map((kw) => (
                <Text key={kw} style={styles.keyword}>
                  {kw}
                </Text>
              ))}
            </View>
          </>
        )}
      </Page>
    </Document>
  );
}

export default ResumePDF;
