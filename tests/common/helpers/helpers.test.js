/**
 * TEST HELPERS 
 */

import { assert } from "chai"
import detectBrowser, { BROWSER_CHAIN } from "notipp/common/helpers/general/detectBrowser.js"
import Sinon from "sinon"
import childProcess from "child_process"
import displayImage from "../../../common/helpers/general/displayImage.js"
import generateDeviceName from "../../../common/helpers/general/generateDeviceName.js"
import capitalize from "../../../common/helpers/general/capitalize.js"
import isExpired from "../../../common/helpers/general/isExpired.js"
import isMobile from "../../../common/helpers/general/isMobile.js"

describe("Common/Helpers", () => {

    afterEach(() => {
        Sinon.restore();
    })

    describe(".detectBrowser()", () => {
        it(`must detect browsers properly <- ${BROWSER_CHAIN}`, () => {
            for(let browserName of BROWSER_CHAIN) { 
                const userAgent = `...${browserName}...`;
                assert.equal(detectBrowser(userAgent), browserName)
            }
        })

        it("must return 'others' on an unknown browser", () => {
            const userAgent = `...unknown-browser...`
            assert.equal(detectBrowser(userAgent), "others")
        })
    })

    describe(".displayImage()", () => {
        it(`must called execSync(...) function with proper arguments`, () => {
            const execSycnStub = Sinon.stub(childProcess, "execSync")
            displayImage("images/image.png")
            const expectedCommandString = 
                `display "images/image.png"`
            Sinon.assert.calledWith(
                execSycnStub, 
                expectedCommandString
            );
        })
    })

    describe(".generateDeviceName()", () => {
        it("must generate a proper device name", () => {
            const deviceName = generateDeviceName(); 
            assert.isTrue(/[A-Za-z0-9-]+/.test(deviceName))
            assert.isTrue(deviceName.split("-").length == 2)
        })  
    })

    describe(".capitalize()", () => {
        it("must capitalize a word", () => {    
            assert.isTrue(capitalize("hello")[0] == "H")
        })
    })

    describe(".isExpired()", () => {
        it("must return true when a date is past the current date", () => {
            const hasExpired = 
                isExpired(new Date(2024, 0, 1), new Date(2023, 11, 31))
            assert.isTrue(hasExpired)
        })

        it("must return false when date is before the current date", () => {
            const hasExpired = 
                isExpired(new Date(2023, 11, 30), new Date(2023, 11, 31))
            assert.isFalse(hasExpired)
        })
    })

    describe(".isMobile()", () => {
        it("must detect a mobile device properly",  () => {
            const mobileUserAgent = 
                "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N)" +
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0" +
                "Mobile Safari/537.36" 
            
            assert.isTrue(isMobile(mobileUserAgent))
        })
        it("must detect a non-mobile device properly", () => {
            const nonMobileUserAgent = 
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" +
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

            assert.isFalse(isMobile(nonMobileUserAgent))
        })
    })

})
