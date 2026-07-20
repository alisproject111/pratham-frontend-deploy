import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import PackageCard from "./PackageCard"
import { getCachedAllPackages, setCachedAllPackages } from "../utils/dataCache"
import { apiEndpoints } from "../config/api"
import { SkeletonGrid } from "./SkeletonLoader"

const listStyles = `
  .package-list-container { margin-top: 30px; margin-bottom: 60px; }
  .package-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px; }
  .package-card-wrapper { animation: packageFadeIn 0.5s ease forwards; }
  .package-no-results { text-align: center; padding: 60px 0; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05); animation: packageFadeIn 0.5s ease; }
  .package-no-results i { color: #ddd; margin-bottom: 20px; }
  .package-no-results h3 { font-size: 1.5rem; margin-bottom: 10px; color: #555; }
  .package-no-results p { color: #888; max-width: 400px; margin: 0 auto; }
  .package-results-summary { margin-bottom: 20px; padding: 10px 15px; background-color: #f0f8ff; border-radius: 8px; font-size: 0.95rem; color: #555; }
  .package-results-summary span { font-weight: 600; color: #f37121; }
  .package-page-indicator { margin-left: 10px; color: #666 !important; font-weight: normal !important; font-size: 0.9rem; }
  .package-pagination { display: flex; justify-content: center; align-items: center; margin-top: 40px; gap: 10px; }
  .package-pagination-button { padding: 10px 20px; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; color: #333; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .package-pagination-button:hover:not(:disabled) { background-color: #f37121; color: white; border-color: #f37121; }
  .package-pagination-button:disabled { opacity: 0.5; cursor: not-allowed; }
  .package-page-numbers { display: flex; align-items: center; gap: 8px; }
  .package-page-number { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background-color: #f8f9fa; border: 1px solid #ddd; color: #333; transition: all 0.3s ease; cursor: pointer; }
  .package-page-number:hover, .package-page-number.package-page-active { background-color: #f37121; color: white; border-color: #f37121; }
  .package-page-ellipsis { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; font-weight: bold; color: #666; }
  @keyframes packageFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 992px) { .package-grid, .package-grid.no-animation { display: flex !important; flex-wrap: wrap; justify-content: center; gap: 20px; } .package-grid > .package-card-wrapper, .package-grid.no-animation > .package-card-wrapper { flex: 0 1 calc(50% - 10px); min-width: 280px; max-width: 450px; margin: 0 auto; } .package-pagination { margin-top: 30px; } }
  @media (max-width: 768px) { .package-list-container { margin-top: 20px; margin-bottom: 40px; } .package-grid, .package-grid.no-animation { display: flex !important; flex-direction: column; align-items: center; gap: 15px; } .package-grid > .package-card-wrapper, .package-grid.no-animation > .package-card-wrapper { width: 100%; max-width: 450px; margin: 0 auto; } .package-results-summary { font-size: 0.85rem; padding: 8px 12px; margin-bottom: 15px; } .package-pagination { flex-wrap: wrap; gap: 8px; margin-top: 25px; } .package-page-numbers { order: 2; width: 100%; justify-content: center; margin-top: 8px; flex-wrap: wrap; } .package-page-number { width: 36px; height: 36px; font-size: 0.9rem; } .package-pagination-button { order: 1; padding: 8px 16px; font-size: 0.9rem; } .package-no-results { padding: 40px 0; } .package-no-results h3 { font-size: 1.3rem; } .package-no-results p { font-size: 0.9rem; } }
  @media (max-width: 576px) { .package-pagination-button { padding: 8px 12px; font-size: 0.85rem; } .package-page-number { width: 32px; height: 32px; font-size: 0.85rem; } .package-page-ellipsis { width: 32px; height: 32px; font-size: 0.85rem; } }
`

function PackageList({ filters = {}, packageType = "all" }) {
  const location = useLocation()
  const navigate = useNavigate()
  const packagesPerPage = 6
  const packageListRef = useRef(null)
  
  const cachedAllPackages = getCachedAllPackages()
  
  const [packagesData, setPackagesData] = useState(cachedAllPackages || [])
  const [loading, setLoading] = useState(!cachedAllPackages)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (cachedAllPackages) return

    const fetchPackagesData = async () => {
      try {
        console.log("[v0] Fetching packages from:", apiEndpoints.getAllPackages)

        const response = await fetch(apiEndpoints.getAllPackages, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          console.error(`[v0] API Error: ${response.status} ${response.statusText}`)
          const errorText = await response.text()
          console.error("[v0] Response:", errorText)
          throw new Error(`Failed to fetch packages: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("[v0] API Response data:", data)

        if (data.success && data.packages) {
          setCachedAllPackages(data.packages || [])
          setPackagesData(data.packages || [])
          console.log(`[v0] Successfully loaded ${data.packages?.length || 0} packages`)
        } else {
          console.error("Failed to fetch packages data:", data.message)
          setPackagesData([])
        }
      } catch (error) {
        console.error("[v0] Error fetching packages data:", error)
        setRetryCount((prevCount) => prevCount + 1)
        if (retryCount < 3) {
          setTimeout(fetchPackagesData, 2000)
        } else {
          setRetryCount(0)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPackagesData()
  }, [retryCount, cachedAllPackages])

  // Set current page based on URL
  const [currentPage, setCurrentPage] = useState(() => {
    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page")
    return page ? Number.parseInt(page, 10) : 1
  })

  // Use useMemo to optimize filtering logic
  const filteredPackages = useMemo(() => {
    let result = [...packagesData]

    // Filter by package type (domestic or international)
    if (packageType === "domestic") {
      result = result.filter((pkg) => pkg.location && pkg.location.toLowerCase().includes("india"))
    } else if (packageType === "international") {
      result = result.filter((pkg) => !pkg.location || !pkg.location.toLowerCase().includes("india"))
    }

    // Apply filters
    if (filters.destination) {
      const searchTerm = filters.destination.toLowerCase()

      // Define common words to filter out
      const commonWords = [
        "india",
        "the",
        "and",
        "&",
        ",",
        "-",
        "of",
        "in",
        "at",
        "to",
        "for",
        "with",
        "by",
        "a",
        "an",
        "escape",
        "retreat",
        "tour",
        "adventure",
        "getaway",
        "vacation",
        "holiday",
        "trip",
        "experience",
        "expedition",
        "journey",
        "splendor",
        "bliss",
        "explorer",
        "package",
        "packages",
        "himalayan",
      ]

      // Extract meaningful words from the search query
      const searchWords = searchTerm.split(/[\s,&-]+/).filter((word) => word.length > 2 && !commonWords.includes(word))

      // If no meaningful words found, use the original search term
      if (searchWords.length === 0) {
        result = result.filter(
          (pkg) => pkg.name.toLowerCase().includes(searchTerm) || pkg.location.toLowerCase().includes(searchTerm),
        )
      } else {
        // Filter packages that match any of the meaningful words
        result = result.filter((pkg) => {
          const packageName = pkg.name.toLowerCase()
          const packageLocation = pkg.location.toLowerCase()

          // Check if any search word is found in the package name or location
          return searchWords.some((word) => packageName.includes(word) || packageLocation.includes(word))
        })
      }
    }

    if (filters.duration) {
      const [min, max] = filters.duration.split("-").map(Number)
      result = result.filter((pkg) => {
        if (max) {
          return pkg.duration >= min && pkg.duration <= max
        } else {
          // For "15+" case
          return pkg.duration >= min
        }
      })
    }

    if (filters.budget) {
      const [min, max] = filters.budget.split("-").map(Number)
      result = result.filter((pkg) => {
        if (max) {
          return pkg.price >= min && pkg.price <= max
        } else {
          // For "3000+" case
          return pkg.price >= min
        }
      })
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          result.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          result.sort((a, b) => b.price - a.price)
          break
        case "duration-low":
          result.sort((a, b) => a.duration - b.duration)
          break
        case "duration-high":
          result.sort((a, b) => b.duration - a.duration)
          break
        default:
          break
      }
    }

    return result
  }, [filters, packageType, packagesData])

  // Calculate total pages
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage)

  // Validate current page and redirect to 404 if invalid
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get("page")
    const pageFromUrl = page ? Number.parseInt(page, 10) : 1

    // Check if page number is invalid
    if (pageFromUrl < 1 || (totalPages > 0 && pageFromUrl > totalPages)) {
      // Redirect to 404 page for invalid page numbers
      navigate("/404", { replace: true })
      return
    }

    setCurrentPage(pageFromUrl)
  }, [location.search, totalPages, navigate])

  // Additional validation for manual URL changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      navigate("/404", { replace: true })
    }
  }, [currentPage, totalPages, navigate])

  // Get current packages
  const indexOfLastPackage = currentPage * packagesPerPage
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage)

  // Change page
  const paginate = (pageNumber) => {
    // Validate page number before navigation
    if (pageNumber < 1 || pageNumber > totalPages) {
      navigate("/404", { replace: true })
      return
    }

    // Create new URL with updated page parameter
    const searchParams = new URLSearchParams(location.search)
    searchParams.set("page", pageNumber.toString())

    // Navigate to the new URL
    navigate(`${location.pathname}?${searchParams.toString()}`)

    // Scroll to top of package list container
    if (packageListRef.current) {
      packageListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  if (loading) {
    return (
      <div className="package-list-container" ref={packageListRef}>
        <div className="package-results-summary" style={{ visibility: 'hidden' }}>
           <p>Loading...</p>
        </div>
        <SkeletonGrid count={packagesPerPage} />
      </div>
    )
  }

  return (
    <div className="package-list-container" ref={packageListRef}>
      <style dangerouslySetInnerHTML={{ __html: listStyles }} />
      {filteredPackages.length === 0 ? (
        <div className="package-no-results">
          <i className="fas fa-search fa-3x"></i>
          <h3>No packages found matching your criteria</h3>
          <p>Try adjusting your search filters or browse our other destinations</p>
        </div>
      ) : (
        <>
          <div className="package-results-summary">
            <p>
              Found <span>{filteredPackages.length}</span> packages matching your criteria
              <span className="package-page-indicator">
                (Page {currentPage} of {totalPages})
              </span>
            </p>
          </div>

          <div className="package-grid">
            {currentPackages.map((pkg) => (
              <div key={pkg._id || pkg.id} className="package-card-wrapper">
                <PackageCard key={pkg._id || pkg.id} package={pkg} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="package-pagination">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="package-pagination-button"
                aria-label="Previous page"
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>

              <div className="package-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={`page-${page}`}
                    onClick={() => paginate(page)}
                    className={`package-page-number ${currentPage === page ? "package-page-active" : ""}`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="package-pagination-button"
                aria-label="Next page"
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PackageList
