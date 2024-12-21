import React, { useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import '../facture.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getFactureDetailsByCode, getFactureDetailsByLivreur } from '../../../../redux/apiCalls/factureApiCalls';
import { Table, Tag } from 'antd';

const FactureDetailLivreur = () => {
  const printRef = useRef();
  const dispatch = useDispatch();
  const facture = useSelector((state) => state.facture.detailFacture);
  const livreur = useSelector((state) => state.auth.user._id);
  const { code_facture } = useParams();

  useEffect(() => {
    dispatch(getFactureDetailsByCode(code_facture));
    dispatch(getFactureDetailsByLivreur(livreur, 'Livreur'));
    window.scrollTo(0, 0);
  }, [dispatch, code_facture, livreur]);

  // Function to generate PDF and download
  const handleDownloadPdf = () => {
    const element = printRef.current;

    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right
      filename: `${facture?.code_facture}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    // Add page numbers
    html2pdf()
      .set(opt)
      .from(element)
      .toContainer()
      .toCanvas()
      .toImg()
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        const totalPages = pdf.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(
            `Page ${i} of ${totalPages}`,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }
      })
      .save();
  };

  // Function to print the PDF
  const handlePrintPdf = () => {
    const element = printRef.current;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${facture?.code_facture}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .outputPdf('bloburl')
      .then(function (pdfUrl) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);
        iframe.onload = function () {
          setTimeout(() => {
            iframe.contentWindow.print();
          }, 1);
        };
      });
  };

  // Calculate the sums for prix and tarif
  const totalPrix =
    facture?.colis?.reduce((acc, col) => acc + (col.montant_a_payer || 0), 0) || 0;

  // Calculate totalTarif based on the count of 'Livrée' colis
  const livreeColisCount = facture?.colis?.filter((col) => col.statut === 'Livrée').length || 0;
  const totalTarif = (facture?.livreur_tarif || 0) * livreeColisCount;

  const difference = totalPrix - totalTarif;

  // Define columns for Table
  const columns = [
    {
      title: 'Code Suivi',
      dataIndex: 'code_suivi',
      key: 'code_suivi',
    },
    {
      title: 'Nom Livreur',
      dataIndex: 'livreur',
      key: 'livreur',
      render: () => facture?.livreur || 'N/A',
    },
    {
      title: 'Destinataire',
      dataIndex: 'destinataire',
      key: 'destinataire',
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: 'Ville',
      dataIndex: 'ville',
      key: 'ville',
    },
    {
      title: 'Statut',
      key: 'statut',
      dataIndex: 'statut',
      render: (text, record) => (
        <>
          {record?.statut === 'Livrée' ? (
            <Tag color="green">{record?.statut}</Tag>
          ) : (
            <Tag color="red">{record?.statut}</Tag>
          )}
        </>
      ),
    },
    {
      title: 'Tarif',
      dataIndex: 'livreur',
      key: 'tarif',
      render: (text, record) => (
        <span>{record?.statut === 'Livrée' ? facture?.livreur_tarif : 0}</span>
      ),
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
      key: 'prix',
      render: (text) => (text ? text.toFixed(2) : 'N/A'),
    },
    {
      title: 'Montant à Payer',
      dataIndex: 'montant_a_payer',
      key: 'montant_a_payer',
    },
  ];

  // Define columns for the calculation table
  const calcColumns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (text) => (text ? text.toFixed(2) : '0.00'),
    },
  ];

  // Data for the calculation table
  const calcData = [
    {
      key: '1',
      description: 'Total Prix',
      total: totalPrix,
    },
    {
      key: '2',
      description: 'Total Tarif',
      total: totalTarif,
    },
    {
      key: '3',
      description: 'Montant à payer',
      total: difference,
    },
  ];

  return (
    <div>
      {/* Buttons to download and print the PDF */}
      <div className="facture-buttons">
        <button onClick={handleDownloadPdf}>Télécharger PDF</button>
        <button onClick={handlePrintPdf}>Imprimer PDF</button>
      </div>

      {/* Facture detail to be converted into PDF */}
      <div className="facture-detail" ref={printRef}>
        <div className="facture-header">
          <div className="facture-title">
            <h2>{facture?.code_facture}</h2>
          </div>
          <div className="facture-info">
            <div className="expediteur">
              <p>
                <strong>Expéditeur:</strong>
              </p>
              <p>{facture?.livreur || 'N/A'}</p>
              <p>{facture?.livreur_tele}</p>
            </div>
            <div className="bon-livraison">
              <p>
                <strong>Bon Livraison:</strong>
              </p>
              <p>#{facture?.code_facture}</p>
              <p>{new Date(facture?.date).toLocaleString()}</p>
              <p>{facture?.colis?.length} Colis</p>
            </div>
          </div>
        </div>

        {/* Table to display the colis details */}
        <div className="table-facture">
          <Table
            className="table-data"
            columns={columns}
            dataSource={facture?.colis}
            pagination={false}
          />
        </div>

        {/* Table to display the calculation of totals */}
        <div className="table-calcul">
          <Table
            className="table-calc-data"
            columns={calcColumns}
            dataSource={calcData}
            pagination={false}
          />
        </div>

        <div className="facture-signatures">
          <div className="signature-client">
            <p>
              <strong>Signature Client:</strong>
            </p>
          </div>
          <div className="signature-livreur">
            <p>
              <strong>Signature du livreur:</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactureDetailLivreur;
