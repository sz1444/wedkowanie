import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const PROJECT_ID = 'fish-4f88d';
const CLIENT_EMAIL = 'firebase-adminsdk-fbsvc@fish-4f88d.iam.gserviceaccount.com';
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDs0W1wO/o8hUpk
j33JL9F3Ua/Sso1O5xWR14UStCx+xCsufAEY2JeqNGvPfk/XFghW5CSXa7eMZ2JF
txTWC/We+q+zkueS9buj+EwoOL4mLXrBMEYadJcSH8juRnUaoG3EtuuK0E6atbje
oNl5HiFOStheUOLS95GBSww0dVjgBTcTvbS5HuJ/RIafYe3RvYFJzWjuDN5LctPS
gmwvnSfFuYWG17XvE7wMwBDXu0ZK7jWETyxDmPYc9MHUzosbJ++mjI7j0hzd8C12
jvhldtQaEc4VGV/KcU9TBayt/fQXzCrJIwcBmSdSdjUD3I0gk3qxGKPgQMcvjRNs
Nv868MunAgMBAAECggEAW9E5Fq5Sb5uYQ9P0h4fwNUxpGI5cxk5HKSP/9sf/hmjF
e0Dd5gW4C+hGMo09JF3o/tN2snSzlg7RZck9nV3GrgxxCfU3rt1yknjnAiM56jBw
6y0tyP0SQ5cqPuP3bEruNDpdqZTpHQe+9SY1G0YI0MOpDyxaPUR6WEBCK6ahvjzY
YOeQ/b4mkXqXKvaNE1ySGxyzet98AsaP53+06RvrdqEGvVwRZsJci5uDYNK0CrAG
UFJtIZHlWf6BpI844maaGB8LOA0u7APNJqjHm81e8i4qXGczemFgXO7KI2K0ijfs
0A1jt3fw46m/RTEyC87Jwd9z8FlJzg1X1Wy8gHJiCQKBgQD9zQtxUIjTT2ojS05F
SkPTtDzt+Eh/LC7WfmRpc9S3ZybOzyL2f905shgKx3dDNoomOWFuwVIdzVA98Eog
iP+errt09lGghE4bo0TzFY/9C8FMrZmyWHoXblJmpcPMcTrrVgVq3H0ijIisBpfi
siyU+cjrGKDUbr8BCCflPIqb6QKBgQDu3raOaeEeqSi/6W5WdE5i4GDGPpgoolHx
C+yErq/tAaREApmseFQAJ9PYTLRhKnbmYTjf9dYd7NvlXL+P3gMYJyw9t9aq1YSJ
yIzHpHN6qGeuuxw9HlW2zf6rPQ6OYssbrHXameRTXKcyhsq8bNT4hPWp3FoNNOMm
W1QM46/BDwKBgAb3hPPkWQ0r5eb4HzrpsfjyvqVtplfPV63NpGX8pv8t1rPgnb4U
fnch+2T4Wr6+lYY9Fv6aUe29gBFjMjW4bQPnGgA47r6wQxChJ7hghCZXF0RKk6iA
o0FXZu2oaTqIdSyWnOl1Cf5Ty0Cloa+4Yl7oiGpjr66FJ7sYhTfWtJtZAoGBAI7A
rp0BjbYDJgU6/ePQ8h+JNIyFT+3Iw+uoUpsgwqaDeqXiX/CAoMLPCn2TqaD//brE
k3bUtjeAHBJAkYLrDTJcBsaDnVjO7bxiDDAriY/eIMh9reygulzbUr0HajGRvQw2
zt/rZFalYo6Bm5tr9wLmguIWfAK0fqOnpN1nHNvlAoGAb/uwuYTrK5SJd3PGsFPs
TY0jAGDeZHZYJPVdaX85HRxJs3M/n5tRjt7QsEsIR/W6PefgZ7aApfOHA46LgqoW
HvNahFqjz8R9h3s5pZaHSgBewDeClVzKRQbmkExtocWedZz/2pwJ4rF4hHVnjFgu
KRaK5TKUirNmCliwAok2Dxo=
-----END PRIVATE KEY-----
`;

const USERS_COLLECTION = 'artifacts/fishrank-universal/public/data/users';
const TARGET_EMAIL = 'arkadiuszwierzbicki1@wp.pl';
const BONUS_XP = 25000;

if (getApps().length === 0) {
  initializeApp({ credential: cert({ projectId: PROJECT_ID, clientEmail: CLIENT_EMAIL, privateKey: PRIVATE_KEY }) });
}

const db = getFirestore();
const auth = getAuth();

const user = await auth.getUserByEmail(TARGET_EMAIL);
console.log(`Found user: ${user.uid} (${user.email})`);

await db.collection(USERS_COLLECTION).doc(user.uid).set(
  { role: 'admin', bonusXp: BONUS_XP },
  { merge: true }
);

console.log(`Done — uid=${user.uid}, role=admin, bonusXp=${BONUS_XP}`);
