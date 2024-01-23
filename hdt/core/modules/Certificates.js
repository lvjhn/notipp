/** 
 * Certificates Module 
 */

import { exec } from "child_process"
import { BASE_PATH } from "../../../index.js"
import Core from "../Core.js"
import crypto, { Certificate } from "crypto"
import fs from "fs/promises"

export default class Certificates 
{
    /**
     * Gets CA cerificate object. 
     */
    static async getCACertificate() {
        const CA_CERT_BASEDIR = BASE_PATH + "/common/ca"
        const CA_PREFIX = "hdt-ca"
        const CA_CERT_FILE = CA_CERT_BASEDIR + "/" + CA_PREFIX + ".pem" 
        const CA_CONTENT = (await fs.readFile(CA_CERT_FILE)).toString()
        const CERT = new crypto.X509Certificate(CA_CONTENT)
        return CERT
    } 

    /** 
     * Gets Server SSL certificate object.
     */
    static async getServerSSLCertificate() {
        const CA_CERT_BASEDIR = BASE_PATH + "/hdt/data/certificate"
        const CA_PREFIX = "server-ssl" 
        const CA_CERT_FILE = CA_CERT_BASEDIR + "/" + CA_PREFIX + ".pem" 
        const CA_CONTENT = (await fs.readFile(CA_CERT_FILE)).toString()
        const CERT = new crypto.X509Certificate(CA_CONTENT)
        return CERT
    }

    /**
     * Get expiration date. 
     */
    static async getExpirationDate(type = "ca-cert") {
        let cert;

        // get certificate object
        if(type == "ca-cert") {
            cert = await Certificates.getCACertificate()
        }
        else if(type == "server-ssl-cert") {
            cert = await Certificates.getServerSSLCertificate()
        }
        else {
            throw Error("Unknown certificate type [" + type + "]") 
        }

        const expirationDate = new Date(cert.validTo);

        return expirationDate
    }

    /**
     * Generate CA certificate. 
     */
    static async generateCACertificate() {
        return new Promise(async (resolve, reject) => {
            const UTIL_PATH = 
                BASE_PATH + "/common/utils" + 
                "/generators/generate-ca-certificate.sh"

            const username =
                await Core.GeneralInfo.getUsername()

            exec(`bash ${UTIL_PATH} ${username}`, (error, stdout, stderr) => {
                if(error) {
                    reject(error)
                }
                resolve(true)
            })
        })
    }

    /**
     * Generate Server's SSL certificate. 
     */
    static async generateServerSSLCertificate() {
        return new Promise(async (resolve, reject) => {
            const UTIL_PATH = 
                BASE_PATH + "/common/utils" + 
                "/generators/generate-server-ssl-certificate.sh"

            const username =
                await Core.GeneralInfo.getUsername()

            exec(`bash ${UTIL_PATH} ${username}`, (error, stdout, stderr) => {
                if(error) {
                    reject(error); 
                } 
                resolve(true)
            })
        })
    }

    /**
     * Get CA's fingerprint. 
     */
    static async getFingerprint(type = 'ca-cert') {
        return new Promise(async (resolve, reject) => {
            let cert;

            // get certificate object
            if(type == "ca-cert") {
                cert = await Certificates.getCACertificate()
            }
            else if(type == "server-ssl-cert") {
                cert = await Certificates.getServerSSLCertificate()
            }
            else {
                throw Error("Unknown certificate type [" + type + "]") 
            }
    
            resolve(cert.fingerprint)
        })
    }
}